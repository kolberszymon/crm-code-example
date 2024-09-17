import { prisma } from '@/lib/init/prisma';

export default async function fetchOne(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const passwordSetLink = await prisma.passwordSetLink.findUnique({
      where: {
        token: req.query.token
      }
    });

    res.status(200).json(passwordSetLink);
  } catch (error) {
    console.error('Error fetching password set link:', error);
    res.status(500).json({ message: 'Error fetching password set link' });
  }
}
