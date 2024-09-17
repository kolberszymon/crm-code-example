import { getTransporter } from '@/lib/init/nodemailer';

export async function sendEmail({ to, subject, text, html }) {
  const mailTransporter = getTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}