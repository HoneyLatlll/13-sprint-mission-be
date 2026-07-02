import { Prisma } from "@prisma/client";

export default function errorHandler(error, req, res, next) {
  let status = null;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      status = 409;
    } else {
      status = 500;
    }
  } else {
    status = error.code ?? 500;
  }

  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "서버 에러",
    data: error.data ?? undefined,
    date: new Date(),
  });
}
