import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private readonly modelName = process.env.GEMINI_MODEL || 'gemini-pro';
  private readonly apiKey = process.env.GEMINI_API_KEY;

  private get endpointUrl(): string {
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent`;
  }

  async generateReply(subject: string, body: string): Promise<string> {
    console.log('~~~~~~ Generating content ~~~~~~~');
    const prompt = this.buildPrompt(subject, body);

    try {
      const response = await axios.post(
        `${this.endpointUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('LLM REPLY =================> ', reply);
      return reply || 'Could not generate a response.';
    } catch (error) {
      this.logger.error('LLM generation failed', error);
      return 'Error generating reply.';
    }
  }

  private buildPrompt(subject: string, body: string): string {
    return `
You are a professional email assistant. Based on the following email content, generate a polite and helpful reply:

Subject: ${subject}

Body:
${body}

Your response should be clear, context-aware, and useful. Avoid unnecessary repetition. Only return the message body (no greeting or sign-off).
Do not use heavy vocabulary, keep it simple. In the response, only return the email content.
    `.trim();
  }
}
