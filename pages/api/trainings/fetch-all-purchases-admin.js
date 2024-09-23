import { prisma } from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const trainingPurchases = await prisma.trainingPurchase.findMany({
      include: {
        training: true
      }
    });

    return res.status(200).json(trainingPurchases);
  } catch (error) {
    console.error('Error fetching training purchases:', error);
    return res.status(500).json({ message: 'Error fetching training purchases' });
  }
}