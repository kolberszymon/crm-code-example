import { prisma } from '@/lib/init/prisma';
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";
import { Role } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { id } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid merchant ID' });
  }

  try {
    const merchantData = await prisma.merchantData.findUnique({
      where: { id }
    });

    if (!merchantData) {
      return res.status(404).json({ success: false, message: 'Merchant data not found' });
    }

    const merchant = await prisma.user.update({
      where: { id: merchantData.userId },
      data: {
        isActive: false
      }
    });

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found' });
    }

    res.status(200).json({ success: true, message: 'Merchant zdeaktywowany' });
  } catch (error) {
    console.error('Error deactivating merchant:', error);
    res.status(500).json({ success: false, message: 'Error deactivating merchant' });
  }
}