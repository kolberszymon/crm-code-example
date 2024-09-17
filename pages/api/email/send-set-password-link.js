
import { sendEmail } from '@/lib/send-email';
import crypto from 'crypto';
import { prisma } from '@/lib/init/prisma';

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email } = JSON.parse(req.body);

  console.log(req.body);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
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
  
  await sendEmail({
    to: email,
    subject: 'Create your password',
    text: `Click here to create your password:`,
    html: `<p>Click <a href="http://localhost:3000/set-new-password/${token}">here</a> to create your password.</p>`,
  });

  res.status(201).json({ success: true, message: 'Password set link sent' });
}