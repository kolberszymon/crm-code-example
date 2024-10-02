import {prisma} from '@/lib/init/prisma';
import { Role } from '@prisma/client';
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
    accountType,
    merchantName,
    firstName,
    lastName,
    email,
    phone,
    nip,
    accountNumber,
    country,
    city,
    street,
    houseNumber,
    apartmentNumber,
    postalCode,
    billingAddress,
    billingCountry,
    billingPostalCode,
    billingCity,
    billingStreet,
    billingHouseNumber,
    billingApartmentNumber,
    id
  } = JSON.parse(req.body);

  console.log(req.body)

  try {
    // Check if a merchant with the same email or phone already exists
    const existingMerchant = await prisma.merchantData.findUnique({
      where: {
        id: id
      },
      include: {
        user: true
      }
    });

    if (!existingMerchant) {
      return res.status(400).json({ success: false, message: 'Merchant z tym id' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: phone },
        ],
      },
    });

    if (existingUser && existingUser.id !== existingMerchant.user.id) {
      return res.status(400).json({ success: false, message: 'Użytkownik z tym emailem lub telefonem już istnieje' });
    }

    await prisma.$transaction(async (prisma) => {

      await prisma.user.update({
        where: {
          id: existingMerchant.user.id,
        },
        data: {
          email: email.trim().length > 0 ? email : null,
          phone: phone.trim().length > 0 ? phone : null,
          role: accountType === 'Edit' ? Role.MERCHANT_EDIT : Role.MERCHANT_VIEW,
        },
      });

      await prisma.merchantData.update({
        where: {
          id: existingMerchant.id,
        },
        data: {
          accountType,
          merchantName,
          firstName,
          lastName,                    
          nip,
          accountNumber,
          country,
          city,
          street,
          houseNumber,
          apartmentNumber,
          postalCode,
          billingAddress,
          billingCountry,
          billingPostalCode,
          billingCity,
          billingStreet,
          billingHouseNumber,
          billingApartmentNumber,
        },
      });
    });

    

    res.status(201).json({ success: true, message: 'Merchant został zaktualizowany' });
  } catch (error) {
    console.error('Error updating merchant:', error);
    res.status(500).json({ message: 'Error updating merchant' });
  }
}