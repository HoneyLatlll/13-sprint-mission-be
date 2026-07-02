import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

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

export default createUser;
