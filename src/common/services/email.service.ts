import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = this.configService.get('SMTP_HOST');
    const smtpPort = this.configService.get('SMTP_PORT', '587');
    const smtpUser = this.configService.get('SMTP_USER');
    const smtpPassword = this.configService.get('SMTP_PASSWORD');
    const smtpSecure = this.configService.get('SMTP_SECURE', 'false') === 'true';

    // Si les variables SMTP ne sont pas configurées, on utilise un transport de test
    if (!smtpHost || !smtpUser || !smtpPassword) {
      this.logger.warn('⚠️  SMTP non configuré, utilisation du mode test (emails ne seront pas envoyés)');
      this.logger.warn('⚠️  Configurez SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD pour envoyer des emails');
      
      // En développement, on peut utiliser un transport de test
      // Les emails seront affichés dans la console mais pas envoyés
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'test',
          pass: 'test',
        },
      });
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    this.logger.log('✅ Service email configuré');
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    if (!this.transporter) {
      this.logger.error('❌ Transport email non initialisé');
      throw new Error('Service email non configuré');
    }

    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: this.configService.get('SMTP_FROM', this.configService.get('SMTP_USER')),
      to: email,
      subject: 'Réinitialisation de votre mot de passe - Dayang Transport',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #2563eb;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Réinitialisation de mot de passe</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte administrateur Dayang Transport.</p>
              <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
              </p>
              <p>Ou copiez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
              <p><strong>Ce lien est valide pendant 1 heure.</strong></p>
              <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
              <p>Cordialement,<br>L'équipe Dayang Transport</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Réinitialisation de votre mot de passe - Dayang Transport
        
        Bonjour,
        
        Vous avez demandé la réinitialisation de votre mot de passe pour votre compte administrateur.
        
        Cliquez sur le lien suivant pour réinitialiser votre mot de passe :
        ${resetUrl}
        
        Ce lien est valide pendant 1 heure.
        
        Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
        
        Cordialement,
        L'équipe Dayang Transport
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email de réinitialisation envoyé à ${email}`);
      this.logger.debug(`Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`❌ Erreur lors de l'envoi de l'email à ${email}:`, error);
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
  }
}
