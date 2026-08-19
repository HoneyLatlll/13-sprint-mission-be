import { expressjwt } from "express-jwt";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
});

const optionalAccessToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
  credentialsRequired: false,
});

export default { verifyAccessToken, optionalAccessToken };
