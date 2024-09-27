import { prisma } from '@/lib/init/prisma';
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";
import { Role } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN, Role.MERCHANT_EDIT, Role.MERCHANT_VIEW]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid transaction ID' });
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      include: {
        to: {
          select: {
            merchantData: {
              include: {
                user: true
              }
            },
            employeeData: {
              include: {
                user: true
              }
            }        
          }
        },
        from: {
          select: {
            merchantData: {
              include: {
                user: true
              }
            },
            employeeData: {
              include: {
                user: true
              }
            }            
          }
        }                     
      },
      where: { id }
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ success: false, message: 'Error fetching transaction' });
  }
}