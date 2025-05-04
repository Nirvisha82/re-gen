import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GmailModule } from './gmail/gmail.module';
import { LLMService } from './llm/llm.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [GmailModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, LLMService],
})
export class AppModule {}
