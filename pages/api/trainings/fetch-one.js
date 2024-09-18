import {prisma} from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid training ID' });
  }

  try {
    const training = await prisma.training.findUnique({
      where: { id }
    });

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    res.status(200).json(training);
  } catch (error) {
    console.error('Error fetching training:', error);
    res.status(500).json({ message: 'Error fetching training' });
  }
}