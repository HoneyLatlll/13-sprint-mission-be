import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import createToken from "../utils/token.js";

const createUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      const error = new Error("이메일 이름 비밀번호 모두 필요합니다");
      error.code = 400;
      throw error;
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
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error("이메일, 비밀번호 모두 필요합니다.");
      error.code = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      const error = new Error("등록된 이메일이 아닙니다.");
      error.code = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.encryptedPassword);
    if (!isMatch) {
      const error = new Error("등록된 비밀번호가 아닙니다.");
      error.code = 401;
      throw error;
    }

    const accessToken = createToken(user);
    const { encryptedPassword, ...rest } = user;
    const safeUserData = rest;
    res.status(200).json({ userData: safeUserData, accessToken });
  } catch (err) {
    next(err);
  }
};

export default { createUser, loginUser };
