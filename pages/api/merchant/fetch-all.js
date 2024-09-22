import {prisma} from '@/lib/init/prisma';
import { Role } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const merchants = await prisma.merchantData.findMany({
      include: {
        user: {
          select: {            
            tokens: true,
            id: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        user: {
          isActive: true
        }
      }
    });

    res.status(200).json(merchants);
  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({ message: 'Error fetching merchants' });
  }
}