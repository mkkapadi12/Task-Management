import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import env from "./env.js";

// Create the adapter with your MySQL credentials
const adapter = new PrismaMariaDb({
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  connectionLimit: 10,
});

// Pass adapter to PrismaClient — required in Prisma 7
const prisma = new PrismaClient({
  adapter,
  log: env.server.isDev ? ["warn", "error"] : ["error"],
});

export { prisma };
