import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import createToken from "../utils/token.js";
import { Request, Response } from "express";
import { CustomError } from "../utils/customError.js";
import { CreateUserDto, LoginUserDto } from "../dtos/user.dto.js";
import { Request as JwtRequest } from "express-jwt";

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

  const accessToken = createToken(user);
  const { encryptedPassword, ...rest } = user;
  const safeUserData = rest;
  res.status(200).json({ userData: safeUserData, accessToken });
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

export default { createUser, loginUser, getUser };
