import jwt from "jsonwebtoken";
import { User } from "../generated/prisma/client";

const createToken = (
  user: Pick<User, "id">,
  type: "default" | "refresh" = "default",
) => {
  const payload = { userId: user.id };
  const expiresIn = type === "default" ? "1h" : "1d";
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expiresIn,
  });
  return token;
};

export default createToken;
