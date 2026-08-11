import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import createToken from "../utils/token";
import { Request, RequestHandler, Response } from "express";
import { CustomError } from "../utils/customError";
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from "../dtos/user.dto";
import { Request as JwtRequest } from "express-jwt";
import jwt from "jsonwebtoken";

const createUser = async (
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    // const error = new Error("이메일 이름 비밀번호 모두 필요합니다");
    // error.code = 400;
    // throw error;
    throw new CustomError("이메일, 이름, 비밀번호 모두 필요합니다", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = await prisma.user.create({
    data: {
      email,
      nickname: name,
      encryptedPassword: hashedPassword,
    },
  });

  const { encryptedPassword, ...rest } = userData;
  const safeUserData = rest;

  res.status(201).json(safeUserData);
};

const loginUser = async (req: Request<{}, {}, LoginUserDto>, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("이메일, 비밀번호 모두 필요합니다", 400);
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new CustomError("등록된 이메일이 아닙니다", 401);
  }

  const isMatch = await bcrypt.compare(password, user.encryptedPassword!);
  if (!isMatch) {
    throw new CustomError("등록된 비밀번호가 아닙니다", 401);
  }
  const refreshToken = createToken(user.id, "refresh");
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const accessToken = createToken(user.id);
  const { encryptedPassword, ...rest } = user;
  const safeUserData = rest;
  res.status(200).json({ userData: safeUserData, accessToken, refreshToken });
};

// express의 기본 Request엔 auth 필드가 없어서 express-jwt가 제공하는 Request<T> 사용
// T = { userId: number }: token.js에서 서명한 payload 모양과 일치 (User.id가 Int라서 number)
const getUser = async (req: JwtRequest<{ userId: number }>, res: Response) => {
  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const userId = req.auth.userId;
  const userData = await prisma.user.findUnique({ where: { id: userId } });
  if (!userData) {
    throw new CustomError("해당 유저를 찾을 수 없습니다", 404);
  }
  const { encryptedPassword, ...rest } = userData;
  const safeUserData = rest;
  res.status(200).json(safeUserData);
};

const refreshToken: RequestHandler = async (req, res, next): Promise<void> => {
  const { refreshToken }: RefreshTokenDto = req.body;
  if (!refreshToken) {
    throw new CustomError("리프레시 토큰이 필요합니다", 401);
  }

  //토큰을 디코딩하면 나의 경우 객체가 나옴
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
  if (typeof decoded === "string") {
    throw new CustomError("유효하지 않은 토큰입니다.", 401);
  }
  //createToken에서 payload={userId:user.id}를 만들 때 Prisma Int필드라 JS에서도 number 타입이고 JSON으로 직렬화 될 때 userId:3 과 같이 숫자로 저장된다
  if (typeof decoded.userId !== "number") {
    throw new CustomError("유효하지 않은 토큰입니다.", 401);
  }
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    throw new CustomError("해당 유저를 찾을 수 없습니다", 404);
  }
  if (user.refreshToken !== refreshToken) {
    throw new CustomError("유효한 리프레시 토큰이 아닙니다.", 401);
  }
  const token = createToken(user.id);

  res.json({ accessToken: token });
};

export default { createUser, loginUser, getUser, refreshToken };
