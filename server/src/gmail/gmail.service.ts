import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { PubSub } from '@google-cloud/pubsub';
import { LLMService } from '../llm/llm.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GmailService {
  private oauth2Client;
  private gmail;
  private pubsub: PubSub;
  private logger = new Logger(GmailService.name);
  private readonly historyPath = path.join(__dirname, '..', 'history.json');
  private readonly userStorePath = path.join(
    process.cwd(),
    'src',
    'data',
    'users.json',
  );
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
    this.saveUser(userEmail, {
      tokens,
      historyId: res.data.historyId,
    });

    // Save initial historyId
    if (res.data.historyId) {
      this.saveHistoryId(res.data.historyId);
    }

    return tokens;
  }

  // 3) Handle Pub/Sub push
  async handlePushNotification(reqBody: any) {
    console.log('^^^^^ Handling Push Notification ^^^^^^');

    const userEmail = this.userEmail; // TODO: Replace with dynamic mapping later
    const user = this.getUser(userEmail);

    if (!user) {
      this.logger.error(`User ${userEmail} not found`);
      return;
    }

    try {
      // Rehydrate Gmail client with stored user tokens
      const gmail = this.getGmailClientFromTokens(user.tokens);

      // Decode the Pub/Sub push message
      const msg = JSON.parse(
        Buffer.from(reqBody.message.data, 'base64').toString(),
      );
      const pushHistoryId = String(msg.historyId);

      this.logger.log(`Using historyId: ${user.historyId}`);

      // Fetch new messages since last known historyId
      const res = await gmail.users.history.list({
        userId: 'me',
        startHistoryId: String(user.historyId),
        historyTypes: ['messageAdded'],
      });

      const historyItems = res.data.history || [];
      for (const history of historyItems) {
        for (const message of history.messages || []) {
          await this.createDraftReply(message.id, userEmail, gmail);
        }
      }

      // Save the new historyId only if Gmail successfully responded
      const newHistoryId = res.data.historyId || pushHistoryId;
      this.saveUser(userEmail, { historyId: newHistoryId });
      this.logger.log(`Updated historyId to: ${newHistoryId}`);
    } catch (err) {
      this.logger.error('Error handling push notification:', err);

      if (err.message?.includes('Requested entity was not found')) {
        this.logger.warn('History ID expired. Resetting Gmail watch.');

        const authClient = this.getGmailClientFromTokens(user.tokens);
        const res = await authClient.users.watch({
          userId: 'me',
          requestBody: {
            labelIds: ['INBOX'],
            topicName: this.PUB_SUB_TOPIC,
          },
        });

        if (res.data.historyId) {
          this.saveUser(userEmail, { historyId: res.data.historyId });
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

  private loadUserStore(): Record<string, any> {
    if (!fs.existsSync(this.userStorePath)) return {};
    return JSON.parse(fs.readFileSync(this.userStorePath, 'utf-8'));
  }

  // Save entire user store
  private saveUserStore(store: Record<string, any>) {
    fs.writeFileSync(this.userStorePath, JSON.stringify(store, null, 2));
  }

  // Save or update a single user
  private saveUser(email: string, data: any) {
    const store = this.loadUserStore();
    store[email] = { ...(store[email] || {}), ...data };
    this.saveUserStore(store);
  }

  // Load one user's data
  private getUser(email: string): any {
    const store = this.loadUserStore();
    return store[email];
  }

  // ========== Local History Storage
  private saveHistoryId(id: string | number) {
    fs.writeFileSync(this.historyPath, JSON.stringify({ historyId: id }));
    this.logger.log(`Saved new historyId: ${id}`);
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
