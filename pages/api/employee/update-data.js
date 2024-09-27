import {prisma} from '@/lib/init/prisma';
import { Role } from "@prisma/client";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN, Role.MERCHANT_EDIT, Role.MERCHANT_VIEW]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const {
    firstName,
    lastName,
    email,
    pesel,
    idPassportNumber,
    phone,
    accountNumber,
    country,
    postalCode,
    city,
    street,
    houseNumber,
    apartmentNumber,
    automaticReturnOn,
    recurrentPaymentOn,
    startDate,
    paymentAmount,
    paymentAmountPit,
    paymentFrequency,
    id
  } = req.body;

  try {
    // Check if a merchant with the same email or phone already exists
    const existingEmployee = await prisma.employeeData.findUnique({
      where: {
        userId: id
      },
      include: {
        user: true
      }
    });

    if (!existingEmployee) {
      return res.status(400).json({ success: false, message: 'Pracownik z tym id nie istnieje' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });
    
    if (existingUser && existingUser.id !== existingEmployee.user.id) {
      return res.status(400).json({ success: false, message: 'Pracownik z tym emailem lub telefonem już istnieje' });
    }

    await prisma.$transaction(async (prisma) => {
      if (email && email.length > 0) {
        await prisma.user.update({
          where: {
          id: existingEmployee.user.id,
        },
        data: {
          email,          
          },
        });
      }

      if (phone && phone.length > 0) {
        await prisma.user.update({
          where: {
          id: existingEmployee.user.id,
        },
        data: {
          phone,          
          },
        });
      }


      const newEmployee = await prisma.employeeData.update({
        where: {
          id: existingEmployee.id,
        },
        data: {
          firstName,
          lastName,          
          pesel,
          idPassportNumber,          
          accountNumber,
          country,
          postalCode,
          city,
          street,
          houseNumber,
          apartmentNumber,
          automaticReturnOn,
          recurrentPaymentOn,
          startDate,
          paymentAmount,
          paymentAmountPit,
          paymentFrequency
        },
      });


    });

    res.status(201).json({ success: true, message: 'Pracownik został zaktualizowany' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee' });
  }
}