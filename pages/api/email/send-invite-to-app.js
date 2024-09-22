
import { sendEmail } from '@/lib/send-email';
import crypto from 'crypto';
import { prisma } from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email } = req.body;

  try {

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({ success: true, message: 'User not found' });
  }

  const token = crypto.randomBytes(32).toString('hex');
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
  
  await sendEmail({
    to: email,
    subject: 'Witamy w aplikacji Monlib',
    text: `Kliknij tutaj, aby utworzyć swoje hasło:`,
    html: `<p>Kliknij <a href="http://localhost:3000/set-new-password/${token}">tutaj</a>, aby utworzyć swoje hasło.</p>`,
  });

    res.status(201).json({ success: true, message: 'Password set link sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Błąd po stronie serwera, spróbuj ponownie później.' });
  }
}