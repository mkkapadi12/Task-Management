import "dotenv/config";
import app from "./src/app.js";
import env from "./src/config/env.js";
import { prisma } from "./src/config/prisma.js";

async function main() {
  await prisma.$connect();
  console.log("Prisma connected to MySQL");

  app.listen(env.server.port, () => {
    console.log(`Server running on port ${env.server.port}`);
  });
}

main().catch(async (err) => {
  console.error("Startup error:", err);
  await prisma.$disconnect();
  process.exit(1);
});
