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
    const mail = await transporter.sendMail({
      from: `"Club Ceos Platform"`,
      to: userEmail,
      subject: "Finalisez Votre Inscription au Club Ceos",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <h1 style="color: #4CAF50;">Félicitations !</h1>
          <p>Nous sommes ravis de vous informer que votre demande d'inscription a été validée par notre administrateur.</p>
          <p>Pour finaliser votre inscription, veuillez cliquer sur le lien de paiement ci-dessous :</p>
          <p style="text-align: center;">
            <a href="${paymentLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Accéder au Lien de Paiement</a>
          </p>
          <p>Une fois le paiement effectué, vous aurez accès à toutes les ressources du Club Ceos.</p>
          <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter.</p>
          <p>Cordialement,</p>
          <p>L'équipe du Club Ceos</p>
        </div>
      `,
    });
    console.log(mail);

    return { OK: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { OK: false, error: 'Échec de l\'envoi de l\'email' };
  }
}