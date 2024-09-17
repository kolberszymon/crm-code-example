import {prisma} from '@/lib/init/prisma';
import { LogIcon, Role } from "@prisma/client";
import crypto from 'crypto';
import { Argon2id } from "oslo/password";

export function generateRandomPassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

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
    role,
  } = req.body;

  try {
    // Check if a merchant with the same email or phone already exists
    const existingMerchant = await prisma.merchantData.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (existingMerchant) {
      return res.status(400).json({ success: false, message: 'Merchant z tym emailem lub telefonem już istnieje' });
    }

    // Check if a user with the same email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Merchant z tym emailem lub telefonem już istnieje' });
    }

    await prisma.$transaction(async (prisma) => {
      const hashedPassword = await new Argon2id().hash(generateRandomPassword(12));

      const newUser = await prisma.user.create({
        data: {
          email,
          phone,
          role,
          hashedPassword
        },
      });

      const newMerchant = await prisma.merchantData.create({
        data: {
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
          userId: newUser.id,
        },
      });

      console.log("newMerchant")
      console.log(newMerchant)

      await prisma.log.create({
        data: {      
          message: `Dodano nowego merchanta ${newMerchant.merchantName}`,
          icon: LogIcon.PLUS,
        },
      });

    });

    res.status(201).json(newMerchant);
  } catch (error) {
    console.error('Error creating merchant:', error);
    res.status(500).json({ message: 'Error creating merchant' });
  }
}