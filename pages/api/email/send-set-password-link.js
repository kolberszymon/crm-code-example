
import { sendEmail } from '@/lib/send-email';
import crypto from 'crypto';
import { prisma } from '@/lib/init/prisma';
import { createEmailTemplateHTML } from '@/helpers/createEmailTemplate';

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, type } = JSON.parse(req.body);

  try {

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({ success: true, message: 'User not found' });
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now


  await prisma.$transaction(async (prisma) => {

    // deactivate all active password set links for this user
    await prisma.passwordSetLink.updateMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    await prisma.passwordSetLink.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
        isActive: true,
      },
    });

  });
  
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const inviteUrl = `${protocol}://${host}/set-new-password/${token}?type=${type}`;
  
  await sendEmail({
    to: email,
    subject: 'Witamy w aplikacji Monlib',
    text: `Kliknij tutaj, aby utworzyć swoje hasło:`,
    html: createEmailTemplateHTML('Witamy w aplikacji Monlib', `<p>Kliknij <a href="${inviteUrl}">tutaj</a>, aby utworzyć swoje hasło.</p>`),
  });

    res.status(201).json({ success: true, message: 'Password set link sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Błąd po stronie serwera, spróbuj ponownie później.' });
  }
}