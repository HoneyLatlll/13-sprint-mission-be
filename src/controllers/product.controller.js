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

const deleteProduct = async (req, res, next) => {
  const authorId = req.auth.userId;
  const { productId } = req.params;
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });
  if (!product) {
    const error = new Error("해당 상품을 찾을 수 없습니다.");
    error.code = 404;
    return next(error);
  }
  if (product.authorId !== authorId) {
    const error = new Error("본인이 등록한 상품이 아닙니다.");
    error.code = 403; //403은 소유권 불일치 에러
    return next(error);
  }
  await prisma.product.delete({
    where: {
      id: Number(productId),
    },
  });
  res.status(200).json({ message: "상품이 삭제되었습니다." });
};

const updateProduct = async (req, res, next) => {
  const authorId = req.auth.userId;
  const images = req.files.map((file) => `uploads/${file.filename}`);

  const { productId } = req.params;
  const { price, tags, description, name, existingImages } = req.body;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });
  if (!product) {
    const error = new Error("해당 상품을 찾을 수 없습니다.");
    error.code = 404;
    return next(error);
  }
  if (product.authorId !== authorId) {
    const error = new Error("본인이 등록한 상품이 아닙니다.");
    error.code = 403;
    return next(error);
  }

  const validExistingImages = (existingImages ?? []).filter((img) =>
    product.images.includes(img),
  );
  const newImages = images;
  const finalImages = [...validExistingImages, ...newImages];

  if (finalImages.length < 1 || finalImages.length > 3) {
    const error = new Error("이미지는 최소 1개 이상 3개 이하여야 합니다.");
    error.code = 400;
    return next(error);
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: Number(productId),
    },
    data: {
      price: Number(price),
      tags,
      description,
      name,
      images: finalImages,
    },
  });

  res.status(200).json(updatedProduct);
};

export default { createProduct, deleteProduct, updateProduct };
