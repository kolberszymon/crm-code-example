import {prisma} from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const trainings = await prisma.training.findMany({          
      orderBy: {
        createdAt: 'desc',
      }
    });

    res.status(200).json(trainings);
  } catch (error) {
    console.error('Error fetching trainings:', error);
    res.status(500).json({ message: 'Error fetching trainings' });
  }
}