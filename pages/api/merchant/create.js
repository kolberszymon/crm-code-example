import {prisma} from '@/lib/init/prisma';
import { sendEmail } from '@/lib/send-email';
import { LogIcon, Role } from "@prisma/client";
import crypto from 'crypto';
import { Argon2id } from "oslo/password";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";
import { createEmailTemplateHTML } from "@/helpers/createEmailTemplate";

export function generateRandomPassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN]);
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
    role,
  } = req.body;

  try {
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

    const token = generateToken();

    await prisma.$transaction(async (prisma) => {
      const hashedPassword = await new Argon2id().hash(generateRandomPassword(12));
      
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
      const newUser = await prisma.user.create({
        data: {
          email: email.trim().length > 0 ? email : null,
          phone: phone.trim().length > 0 ? phone : null,
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

      await prisma.passwordSetLink.updateMany({
        where: {
          userId: newUser.id,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
  
      await prisma.passwordSetLink.create({
        data: {
          token,
          expiresAt,
          userId: newUser.id,
          isActive: true,
        },
      });  

      await prisma.log.create({
        data: {      
          message: `Dodano nowego merchanta ${newMerchant.merchantName}`,
          icon: LogIcon.PLUS,
        },
      });

      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host;
      const inviteUrl = `${protocol}://${host}/set-new-password/${token}?type=setPassword`;

      await sendEmail({
        to: email,
        subject: 'Stwórz swoje hasło do serwisu monlib',
        text: `Dobrze Cię widzieć. Kliknij w link aby stworzyć swoje hasło do serwisu monlib.`,
        html: createEmailTemplateHTML('Stwórz swoje hasło do serwisu monlib', `<p>Kliknij <a href="${inviteUrl}">tutaj</a> aby stworzyć swoje hasło do serwisu monlib.</p>`),
      });
    });



    res.status(201).json({ success: true, message: 'Merchant został dodany' });
  } catch (error) {
    console.error('Error creating merchant:', error);
    res.status(500).json({ message: 'Error creating merchant' });
  }
}