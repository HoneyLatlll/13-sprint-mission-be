import jwt from "jsonwebtoken";

const createToken = (user) => {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export default createToken;
