import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { PubSub } from '@google-cloud/pubsub';
import { LLMService } from '../llm/llm.service';
import * as fs from 'fs';
import * as path from 'path';
import { UserRepository } from '../database/user.repository';

@Injectable()
export class GmailService {
  private oauth2Client;
  private gmail;
  private pubsub: PubSub;
  private logger = new Logger(GmailService.name);
  private readonly userRepo = new UserRepository();

  private readonly llmService: LLMService;
  private CLIENT_ID = `${process.env.CLIENT_ID}`;
  private CLIENT_SECRET = `${process.env.CLIENT_SECRET}`;
  private CALLBACK_URL = `${process.env.CALLBACK_URL}`;
  private PUB_SUB_TOPIC = `${process.env.PUB_SUB_TOPIC}`;
  private userEmail: string;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      this.CALLBACK_URL,
    );

    this.pubsub = new PubSub();
    this.llmService = new LLMService();
  }

  // 1) Generate OAuth URL
  getAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/gmail.modify'];
    console.log('------- Generating Auth URL ------');
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  // 2) Exchange code for tokens and start watch
  async handleOAuthCallback(code: string) {
    console.log(' ---- Handling OAuth Callback ---- ');
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    console.log('logging url===============> ', tokens);
    const profile = await this.gmail.users.getProfile({ userId: 'me' });
    const userEmail = profile.data.emailAddress;
    this.userEmail = userEmail;
    this.logger.log(`Authenticated user: ${userEmail}`);

    // Start Gmail watch
    const res = await this.gmail.users.watch({
      userId: 'me',
      requestBody: {
        labelIds: ['INBOX'],
        topicName: this.PUB_SUB_TOPIC,
      },
    });
    this.userRepo.saveOrUpdate({
      email: userEmail,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type,
      scope: tokens.scope,
      refresh_token_expires_in: tokens.refresh_token_expires_in,
      expiry_date: tokens.expiry_date,
      history_id: res.data.historyId,
    });

    return tokens;
  }

  // 3) Handle Pub/Sub push
  async handlePushNotification(reqBody: any) {
    console.log('^^^^^ Handling Push Notification ^^^^^^');
    
    const msg = JSON.parse(
      Buffer.from(reqBody.message.data, 'base64').toString(),
    );



    const userEmail = msg.emailAddress;  // Gmail includes this
    const historyId = msg.historyId;
  
    this.logger.log(`Push received for user: ${userEmail}, historyId: ${historyId}`);
    const user = this.userRepo.findByEmail(userEmail);

    if (!user) {
      this.logger.error(`User ${userEmail} not found`);
      return;
    }

      // Auth Gmail client from stored tokens
    const gmail = this.getGmailClientFromTokens(user);

    // try {
    //   // Rehydrate Gmail client with stored user tokens
    //   const gmail = this.getGmailClientFromTokens(user);


    //   // Decode the Pub/Sub push message
    //   const msg = JSON.parse(
    //     Buffer.from(reqBody.message.data, 'base64').toString(),
    //   );
    //   const pushHistoryId = String(msg.historyId);

    //   this.logger.log(`Using historyId: ${user.history_id}`);

      // Fetch new messages since last known historyId
      try {
        // Fetch new messages since last known history
        const res = await gmail.users.history.list({
          userId: 'me',
          startHistoryId: String(user.history_id),
          historyTypes: ['messageAdded'],
        });

        const historyItems = res.data.history || [];
        for (const history of historyItems) {
          for (const message of history.messages || []) {
            await this.createDraftReply(message.id, userEmail, gmail);
          }
        }
    

      // Save new historyId
      const newHistoryId = res.data.historyId || historyId;
      this.userRepo.updateHistoryId(userEmail, newHistoryId);
      this.logger.log(`Updated historyId for ${userEmail} to: ${newHistoryId}`);
    } catch (err) {
      this.logger.error(`Failed to process Gmail push for ${userEmail}`, err);

      if (err.message?.includes('Requested entity was not found')) {
        this.logger.warn('History ID expired. Resetting watch...');
        const res = await gmail.users.watch({
          userId: 'me',
          requestBody: {
            labelIds: ['INBOX'],
            topicName: this.PUB_SUB_TOPIC,
          },
        });

        if (res.data.historyId) {
          this.userRepo.updateHistoryId(userEmail, res.data.historyId);
          this.logger.log(`Watch reset. New historyId: ${res.data.historyId}`);
        }
        
      }
    }
  }

  // ========== Draft Reply with Filters
  async createDraftReply(messageId: string, userEmail: string, gmail: any) {
    console.log('Drafting a reply.');

    // 1. Get message metadata
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'metadata',
      metadataHeaders: [
        'Subject',
        'Message-ID',
        'References',
        'In-Reply-To',
        'From',
        'To',
        'Cc',
      ],
    });

    if (!message.data.labelIds?.includes('INBOX')) {
      this.logger.log(`Skipping message not in INBOX: ${messageId}`);
      return;
    }

    const headers = message.data.payload.headers;

    const from = headers.find((h) => h.name === 'From')?.value || '';
    const subject = headers.find((h) => h.name === 'Subject')?.value || '';
    const messageIdHeader =
      headers.find((h) => h.name === 'Message-ID')?.value || '';
    const referencesHeader =
      headers.find((h) => h.name === 'References')?.value || '';
    const toHeader = headers.find((h) => h.name === 'To')?.value || '';
    const ccHeader = headers.find((h) => h.name === 'Cc')?.value || '';

    if (from.includes(userEmail)) {
      this.logger.log(`Skipping self-sent message: ${messageId}`);
      return;
    }

    const inReplyTo = messageIdHeader;
    const references = referencesHeader
      ? `${referencesHeader} ${messageIdHeader}`
      : messageIdHeader;

    const threadId = message.data.threadId;

    // 2. Compute recipients
    const to = from;
    const ccList = [toHeader, ccHeader]
      .flatMap((header) => (header || '').split(','))
      .map((addr) => addr.trim())
      .filter((addr) => addr && !addr.includes(userEmail));

    const cc = [...new Set(ccList)].join(', '); // remove duplicates

    // 3. Generate reply content using LLM
    const bodyMsg = await this.extractEmailBody(messageId, gmail);
    const replyContent = await this.llmService.generateReply(subject, bodyMsg);

    // 4. Build raw RFC2822 message
    const rawLines = [
      `To: ${to}`,
      ...(cc ? [`Cc: ${cc}`] : []),
      `Subject: ${subject}`,
      `In-Reply-To: ${inReplyTo}`,
      `References: ${references}`,
      'Content-Type: text/plain; charset=UTF-8',
      'MIME-Version: 1.0',
      'Content-Transfer-Encoding: 7bit',
      '',
      replyContent,
    ];

    const encodedMessage = Buffer.from(rawLines.join('\r\n'), 'utf-8').toString(
      'base64url',
    );

    const draft = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedMessage,
          threadId,
        },
      },
    });

    this.logger.log(
      `Draft created in thread: ${threadId}, draftId: ${draft.data.id}`,
    );
  }


  private async extractEmailBody(
    messageId: string,
    gmail: any,
  ): Promise<string> {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    const parts = msg.data.payload?.parts || [];
    const textPart = parts.find((part) => part.mimeType === 'text/plain');

    if (textPart?.body?.data) {
      const decoded = Buffer.from(textPart.body.data, 'base64').toString(
        'utf-8',
      );
      return decoded;
    }

    return '(No readable plain text content)';
  }

  private getGmailClientFromTokens(tokens: any) {
    const oauth2 = new google.auth.OAuth2(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      'http://localhost:8080/gmail/auth/callback',
    );
    oauth2.setCredentials(tokens);
    return google.gmail({ version: 'v1', auth: oauth2 });
  }
}
