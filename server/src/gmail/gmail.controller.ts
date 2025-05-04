import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { GmailService } from './gmail.service';

@Controller('gmail')
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Get('auth/url')
  getAuthUrl(@Res() res: any) {
    const url = this.gmailService.getAuthUrl();
    return res.redirect(url);
  }

  @Get('auth/callback')
  async authCallback(@Query('code') code: string, @Res() res: any) {
    await this.gmailService.handleOAuthCallback(code);
    return res.send('Gmail auto-reply activated!');
  }

  @Post('pubsub/push')
  async pubsubPush(@Req() req: Request) {
    console.log('bruh, this got printed');
    await this.gmailService.handlePushNotification(req.body);
    return { status: 'ok' };
  }
}
