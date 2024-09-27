import {prisma} from '@/lib/init/prisma';
import { Role } from '@prisma/client';
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const merchants = await prisma.user.findMany({
      include: {
        merchantData: true
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        role: { in: [Role.MERCHANT_EDIT] },
        isActive: true
      }
    });

    res.status(200).json(merchants);
  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({ message: 'Error fetching merchants' });
  }
}