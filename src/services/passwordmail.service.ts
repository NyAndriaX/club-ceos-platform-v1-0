import nodemailer from 'nodemailer';
import { PasswordmailType } from '@/typings/passwordmail';

export async function sendPassword(params: PasswordmailType): Promise<{ OK: boolean; error?: string }> {
  const { userEmail, password } = params;
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
      from: `"Club Ceos Platform" <${process.env.NEXT_PUBLIC_ADMIN_EMAIL_COMPTE_OUTLOOK}>`,
      to: userEmail,
      subject: "Votre Abonnement au Club Ceos est Confirmé",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <h1 style="color: #4CAF50;">Félicitations et Bienvenue au Club Ceos !</h1>
          <p>Votre inscription a été complétée avec succès.</p>
          <p>Vous pouvez maintenant accéder à notre plateforme en utilisant les informations suivantes :</p>
          <p><strong>Email :</strong> ${userEmail}</p>
          <p><strong>Mot de passe :</strong> ${password}</p>
          <p>Nous vous recommandons de changer votre mot de passe après votre première connexion pour des raisons de sécurité.</p>
          <p>Pour vous connecter, visitez notre site web :</p>
          <p><a href=${process.env.NEXT_PUBLIC_SITE_URL!} style="color: #4CAF50;">Accéder à la plateforme</a></p>
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          <p>Cordialement,</p>
          <p>L'équipe du Club Ceos</p>
        </div>
      `,
    });


    return { OK: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { OK: false, error: 'Échec de l\'envoi de l\'email' };
  }
}