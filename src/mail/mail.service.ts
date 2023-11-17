import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly logger: Logger,
  ) {}

  async sendUserDetails(email: string, password: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: '"Support Team" <berlinseeroo@gmail.com>', // override default from
        subject: 'Mefriend Account',
        template: './registeration', // `.hbs` extension is appended automatically
        context: {
          username: email,
          password,
        },
      });
      console.log(`Email sent to ${email} successfully`);
    } catch (error) {
      console.error(`Failed to send email to ${email}: ${error.message}`);
      this.logger.error(
        error.message,
        error.stack,
        'MailService.sendUserDetails',
      );
      throw error;
    }
  }
}
