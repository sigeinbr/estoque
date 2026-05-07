import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Result, Type } from '../models/result.model';

@Injectable()
export class SendEmailService {
  async send(mail: any): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        to: mail.to,
        subject: mail.subject,
        from: `"Atendimento Cloud" <${process.env.EMAIL_USER}>`,
        text: mail.text,
        html: mail.html,
      });

      console.log('✅ Email sent successfully!');
    } catch (error) {
      console.error('❌ Error sending email:', error);

      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
