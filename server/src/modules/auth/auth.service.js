import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import env from "../../config/env.js";
import { AppError } from "../../middlewares/error.middleware.js";

const signToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

const AuthService = {
  register: async ({ name, email, password }) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError("Email already in use.", 409);

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true },
    });

    const token = signToken({ id: user.id, role: user.role });
    return { user, token };
  },

  login: async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Email is not registered.", 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError("Invalid email or password.", 401);

    const token = signToken({ id: user.id, role: user.role });

    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  },
};

export default AuthService;
