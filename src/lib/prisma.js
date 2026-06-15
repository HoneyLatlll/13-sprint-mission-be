import { PrismaClient } from "@prisma/client";

const isProduction = process.env.NODE_ENV === "production";

const prisma = new PrismaClient({
  //[query]를 터미널 어지러워서 빼놓았음
  log: isProduction ? ["error"] : ["error", "warn"],
});

export default prisma;
