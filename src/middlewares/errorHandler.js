import { Prisma } from "@prisma/client";
import multer from "multer";

export default function errorHandler(error, req, res, next) {
  let status = 500;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // status = error.code === "P2002" ? 409 : 500;
    if (error.code === "P2002") status = 409;
    if (error.code === "P2025") status = 404;
  }

  //이미지 파일 에러 (개수)
  if (error instanceof multer.MulterError) {
    status = 400;
  }

  //토큰이 만료되거나 없을 때 (jwt 에러)
  if (error.name === "UnauthorizedError") {
    status = error.status ?? 401;
  }

  if (typeof error.code === "number") {
    status = error.code;
  }

  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "서버 에러",
    data: error.data ?? undefined,
    date: new Date(),
  });
}
