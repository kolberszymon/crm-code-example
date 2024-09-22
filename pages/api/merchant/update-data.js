import {prisma} from '@/lib/init/prisma';
import { sendEmail } from '@/lib/send-email';
import { LogIcon, Role } from "@prisma/client";
import crypto from 'crypto';
import { Argon2id } from "oslo/password";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
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
          email,
          phone,
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