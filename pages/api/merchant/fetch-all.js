import {prisma} from '@/lib/init/prisma';
import { Role } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const merchants = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.MERCHANT_EDIT, Role.MERCHANT_VIEW]
        },
        isActive: true
      },
      include: {
        merchantData: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(merchants);
  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({ message: 'Error fetching merchants' });
  }
}