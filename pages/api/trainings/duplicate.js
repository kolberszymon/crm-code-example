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

    const duplicate = await prisma.training.create({
      data: {        
        title: `${training.title} - (01)`,
        introduction: training.introduction,
        category: training.category,
        description: training.description,
        fileUrl: training.fileUrl,
        priceTokens: training.priceTokens,
        pricePln: training.pricePln,
      },
    });

    res.status(200).json(duplicate);
  } catch (error) {
    console.error('Error duplicating training:', error);
    res.status(500).json({ message: 'Error duplicating training' });
  }
}