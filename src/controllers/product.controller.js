import prisma from "../config/prisma.js";

const createProduct = async (req, res, next) => {
  const authorId = req.auth.userId;
  const images = req.files.map((file) => `uploads/${file.filename}`);

  const createdProduct = await prisma.product.create({
    data: {
      ...req.body,
      price: Number(req.body.price),
      images,
      authorId,
    },
  });

  res.status(201).json(createdProduct);
};

export default { createProduct };
