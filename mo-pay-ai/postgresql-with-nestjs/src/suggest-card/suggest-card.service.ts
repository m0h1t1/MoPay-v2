import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SuggestCardService {
  async sendSuggestion(card: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mopayhelp@gmail.com',
        pass: 'wgcy doym uenr uksl',
      },
    });

    await transporter.sendMail({
      from: '"Card Suggestion" <mopayhelp@gmail.com>',
      to: 'mopayhelp@gmail.com',
      subject: 'New Card Request',
      text: `A user requested this card: ${card}`,
    });
  }
}
