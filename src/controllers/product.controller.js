import prisma from "../config/prisma.js";

const createProduct = async (req, res, next) => {
  const authorId = req.auth.userId;

  const createdProduct = await prisma.product.create({
    data: {
      ...req.body,
      authorId,
    },
  });

  res.status(201).json(createdProduct);
};

export default { createProduct };
