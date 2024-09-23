
import { sendEmail } from '@/lib/send-email';
import { prisma } from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, trainingPurchaseId } = req.body;

  try {
    if (!email || !trainingPurchaseId) {
      return res.status(400).json({ success: false, message: 'Email and training purchase id is required' });
    }

    const trainingPurchase = await prisma.trainingPurchase.findUnique({
      where: {
        id: trainingPurchaseId,
      },
      include: {
        training: true
      }
    });

    if (!trainingPurchase) {
      return res.status(404).json({ success: true, message: 'Training purchase not found' });
    }

    await sendEmail({
      to: email,
      subject: 'Pobierz swoje szkolenie',
      text: `Kliknij tutaj, aby pobrać swoje szkolenie:`,
      html: `<p>Kliknij <a href="${trainingPurchase.training.fileUrl}">tutaj</a>, aby pobrać swoje szkolenie.</p>`,
    });

    await prisma.trainingPurchase.update({
      where: {
        id: trainingPurchaseId        
      },
      data: {
        emailSent: true
      },
    });

    res.status(201).json({ success: true, message: 'Link with PDF sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Błąd po stronie serwera, spróbuj ponownie później.' });
  }
}