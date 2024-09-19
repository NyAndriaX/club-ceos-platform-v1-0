import nodemailer from 'nodemailer';
import { PaymailType } from '@/typings/paymail';

export async function sendPaymentLink(params: PaymailType): Promise<{ OK: boolean; error?: string }> {
  const { userEmail, paymentLink } = params;

  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.NEXT_PUBLIC_ADMIN_EMAIL_COMPTE_OUTLOOK!,
      pass: process.env.NEXT_PUBLIC_ADMIN_PASSWORD_COMPTE_OUTLOOK!,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Club Ceos Platform" <${process.env.NEXT_PUBLIC_ADMIN_EMAIL_COMPTE_OUTLOOK!}>`,
      to: userEmail,
      subject: "Lien d'abonnement au Club Ceos",
      html: `
        <h1>Félicitations !</h1>
        <p>Votre demande d'inscription a été validée par l'administrateur.</p>
        <p>Pour finaliser votre inscription, voici le lien de paiement :</p>
        <a href="${paymentLink}">${paymentLink}</a>
      `,
    });

    return { OK: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { OK: false, error: 'Échec de l\'envoi de l\'email' };
  }
}