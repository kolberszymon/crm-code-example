import {prisma} from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid merchant ID' });
  }

  try {
    const merchant = await prisma.merchantData.findUnique({
      where: { userId: id },
      include: {
        user: true,        
      }
    });

    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    res.status(200).json(merchant);
  } catch (error) {
    console.error('Error fetching merchant:', error);
    res.status(500).json({ message: 'Error fetching merchant' });
  }
}