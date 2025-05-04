import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GmailModule } from './gmail/gmail.module';

@Module({
  imports: [GmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
