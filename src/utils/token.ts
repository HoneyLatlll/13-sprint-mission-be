import jwt from "jsonwebtoken";
import { User } from "../generated/prisma/client";

const createToken = (
  userId: User["id"],
  type: "default" | "refresh" = "default",
) => {
  const payload = { userId };
  const expiresIn = type === "default" ? "1h" : "1d";
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expiresIn,
  });
  return token;
};

export default createToken;
