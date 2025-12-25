import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { generateToken } from "../utils/jwt.js";

// ================= Register Service =================
export const registerUserService = async ({ email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  
  if (existingUser) {
    throw new Error("User already exists");
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPass } = newUser;
  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });
  
  return { user: userWithoutPass, token };
};

// ================= Login Service =================
export const loginUserService = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("Invalid email or password");

  const isPassValid = await bcrypt.compare(password, user.password);

  if (!isPassValid) throw new Error("Invalid email or password");

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  
  const { password: _, ...userWithoutPass } = user;
  return { user: userWithoutPass, token };
};
