import {prisma} from '@/lib/init/prisma';
import { TransactionStatus, TransferStatus } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { transactions, status } = req.body;

  try {
    if (status === TransferStatus.ROZLICZONE) {
      await prisma.transaction.updateMany({
        where: {
          AND: [
            {
              transferStatus: {
                not: null
              }
            },
            {
              id: {
                in: transactions
              }
            }
          ]
        },
        data: {
          transactionStatus: TransactionStatus.ZAKONCZONO,
          transferStatus: TransferStatus.ROZLICZONE
        }
      });
    } else {
      await prisma.transaction.updateMany({
        where: {
          AND: [
            {
              transferStatus: {
                not: null
              }
            },
            {
              id: {
                in: transactions
              }
            }
          ]
        },
        data: {
          transactionStatus: TransactionStatus.DO_ROZLICZENIA,
          transferStatus: TransferStatus.NIEROZLICZONE
        }
      });      
    }

    res.status(200).json({success: true, message: 'Status transakcji został zmieniony' });
  } catch (error) {
    console.error('Error updating transactions status:', error);
    res.status(500).json({ success: false, message: 'Wystąpił błąd podczas zmieniania statusu transakcji' });
  }
}