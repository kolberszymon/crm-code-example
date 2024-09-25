import {prisma} from '@/lib/init/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
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

    const existingUser = await prisma.user.findUnique({
      where: {
        id: existingEmployee.user.id
      }
    });

    if (existingUser && existingUser.id !== existingEmployee.user.id) {
      return res.status(400).json({ success: false, message: 'Użytkownik z tym emailem lub telefonem już istnieje' });
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: {
          id: existingEmployee.user.id,
        },
        data: {
          email,
          phone,
        },
      });

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