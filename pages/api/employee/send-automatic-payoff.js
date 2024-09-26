import { prisma } from '@/lib/init/prisma';
import { TransactionType } from '@prisma/client';
import { addDays, differenceInDays, isSameDay, startOfDay } from 'date-fns';
import { sendAutomaticMerchantEdit } from '@/lib/api-functions/sendAutomaticMerchantEdit';
import { sendAutomaticMerchantView } from '@/lib/api-functions/sendAutomaticMerchantView';

function isPaymentDay(startDate, frequency) {
  const today = new Date();
  const start = new Date(startDate);

  if (frequency === 'WEEKLY') {
    const daysDiff = differenceInDays(today, start);
    return daysDiff % 7 === 0;
  } else if (frequency === 'BIWEEKLY') {
    const daysDiff = differenceInDays(today, start);
    return daysDiff % 14 === 0;
  } else if (frequency === 'MONTHLY') {
    return today.getDate() === start.getDate();
  }
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const employees = await prisma.employeeData.findMany({
      include: {
        user: true,
        merchant: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        recurrentPaymentOn: true
      }
    });

    const filteredEmployees = employees.filter(employee =>
      isPaymentDay(employee.startDate, employee.paymentFrequency)
    );

    for (const employee of filteredEmployees) {
      // 1. Check if transaction TRANSFER_TOKENS_RECURRENT exists for this employee today

      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          type: TransactionType.TRANSFER_TOKENS_RECURRENT,
          toId: employee.user.id,
          createdAt: {
            gte: startOfDay(new Date()),
            lt: addDays(startOfDay(new Date()), 1),
          },
        },
      });

      if (existingTransaction) {
        console.log("Omijanie przesyłania ponownego dla ", employee.id)
        continue;
      }

      try {
        // 2. Create transaction TRANSFER_TOKENS_RECURRENT
        if (employee.merchant.accountType === "Edit") {
          await sendAutomaticMerchantEdit(employee);
          console.log('Transaction TRANSFER_TOKENS_RECURRENT created for employee', employee.id);
        } else if (employee.merchant.accountType === "View") {
          await sendAutomaticMerchantView(employee);
          console.log('Transaction TRANSFER_TOKENS_RECURRENT created for employee', employee.id);
        }

      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
      }
    }

    return res.status(200).json({ success: true, message: "Tokeny zostały przesłane" });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ message: 'Error fetching employees' });
  }
}