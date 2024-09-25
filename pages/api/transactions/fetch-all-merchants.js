import { prisma } from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Transactions to merchants can go only from admin, merchants can't transfer between other merchants
    const transactions = await prisma.transaction.findMany({
      include: {
        to: {
          select: {
            role: true,            
            merchantData: true
          }
        },
        from: {
          select: {
            role: true,
            merchantData: true
          }
        }
      },
      where: {
        AND: [
          {
            OR: [
              { to: { role: { in: ["MERCHANT_VIEW", "MERCHANT_EDIT"] } } },
              { 
                AND: [
                  { to: { role: "ADMIN" } },
                  { from: { role: { not: "ADMIN" } } }
                ]
              }
            ]
          },
          {
            OR: [
              { from: { role: { in: ["MERCHANT_VIEW", "MERCHANT_EDIT"] } } },
              { 
                AND: [
                  { from: { role: "ADMIN" } },
                  { to: { role: { not: "ADMIN" } } }
                ]
              }
            ]
          }
        ]
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({ message: 'Error fetching merchants' });
  }
}