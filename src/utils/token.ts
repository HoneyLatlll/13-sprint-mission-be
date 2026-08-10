import jwt from "jsonwebtoken";
import { User } from "../generated/prisma/client";

const createToken = (user: Pick<User, "id">) => {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  return token;
};

export default createToken;
