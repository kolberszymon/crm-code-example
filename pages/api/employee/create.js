import {prisma} from '@/lib/init/prisma';
import { LogIcon, Role } from "@prisma/client";
import crypto from 'crypto';
import { Argon2id } from "oslo/password";
import { checkIfUserIsAuthorized } from "@/helpers/checkIfUserIsAuthorized";

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

  const { email, phone, merchantId } = req.body;

  const userId = req.headers["x-user-id"];
  
  try {
    await checkIfUserIsAuthorized(userId, [Role.ADMIN, Role.MERCHANT_EDIT, Role.MERCHANT_VIEW]);
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

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
      return res.status(400).json({ success: false, message: 'Pracownik z tym emailem lub telefonem już istnieje' });
    }

    await prisma.$transaction(async (prisma) => {
      const hashedPassword = await new Argon2id().hash(generateRandomPassword(12));

      const newUser = await prisma.user.create({
        data: {
          email: email.length > 0 ? email : null,
          phone: phone.length > 0 ? phone : null,
          role: Role.EMPLOYEE,
          hashedPassword
        },
      });

      const newEmployeeData = {
        ...req.body,
        paymentAmount: req.body.paymentAmount ? req.body.paymentAmount : null,
        paymentAmountPit: req.body.paymentAmountPit ? req.body.paymentAmountPit : null,
        merchant: { connect: { id: merchantId } },
        user: { connect: { id: newUser.id } }
      }

      delete newEmployeeData.merchantId;
      delete newEmployeeData.email;
      delete newEmployeeData.phone;

      console.log(newEmployeeData)

      const newEmployee = await prisma.employeeData.create({
        data: newEmployeeData,
      });

      console.log("newEmployee")
      console.log(newEmployee)

      await prisma.log.create({
        data: {      
          message: `Dodano nowego pracownika ${newEmployee.firstName} ${newEmployee.lastName}`,
          icon: LogIcon.PLUS,
        },
      });

    });

    res.status(201).json({ success: true, message: 'Pracownik został dodany' });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, message: 'Error creating employee' });
  }
}