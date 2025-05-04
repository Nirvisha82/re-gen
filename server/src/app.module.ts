import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GmailModule } from './gmail/gmail.module';
import { LLMService } from './llm/llm.service';

@Module({
  imports: [GmailModule],
  controllers: [AppController],
  providers: [AppService, LLMService],
})
export class AppModule {}
