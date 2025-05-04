import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class GmailService {
  private oauth2Client;
  private gmail;
  private pubsub: PubSub;
  private logger = new Logger(GmailService.name);

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GCP_CLIENT_ID,
      process.env.GCP_CLIENT_SECRET,
      process.env.CALLBACK_URL,
    );

    this.pubsub = new PubSub();
  }

  // Generate OAuth URL
  getAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/gmail.modify'];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      // prompt forces oAuth to generate refresh token each time.
      prompt: 'consent',
    });
  }

  // Exchange code for tokens and start watch
  async handleOAuthCallback(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    // Start Gmail watch
    await this.gmail.users.watch({
      userId: 'me',
      requestBody: {
        labelIds: ['INBOX'],
        topicName: process.env.GCP_PUBSUB_TOPIC,
      },
    });
    return tokens;
  }

  // Pub/Sub push
  async handlePushNotification(reqBody: any) {
    // Pub/Sub push includes message.data as base64 JSON
    const gmail: any = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const msg = JSON.parse(
      Buffer.from(reqBody.message.data, 'base64').toString(),
    );
    const historyId = msg.historyId;
    // Fetch new messages since last historyId
    const res = await gmail.users.history.list({
      userId: 'me',
      startHistoryId: historyId - 1,
      historyTypes: ['messageAdded'],
    });
    const messages = res.data.history || [];
    for (const h of messages) {
      for (const m of h.messages || []) {
        await this.createDraftReply(m.id);
      }
    }
  }

  // Create dummy draft reply
  async createDraftReply(messageId: string) {
    // Get message details
    const msg = await this.gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'metadata',
    });
    const headers = msg.data.payload.headers;
    const fromHeader = headers.find((h) => h.name === 'From').value;
    const subjectHeader = headers.find((h) => h.name === 'Subject').value;

    const raw = [];
    raw.push(`To: ${fromHeader}`);
    raw.push('Subject: Re: ' + subjectHeader);
    raw.push('Content-Type: text/plain; charset=UTF-8');
    raw.push('');
    raw.push('Thank you for your email!');

    const draft = await this.gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: Buffer.from(raw.join('\r\n'))
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, ''),
        },
      },
    });
    this.logger.log(`Draft created: ${draft.data.id}`);
  }
}
