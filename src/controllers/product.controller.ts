import { prisma } from "../lib/prisma";
import { Request as JwtRequest } from "express-jwt";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { ProductBodyDto } from "../dtos/product.dto";

const createProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;
  const images = (req.files as Express.Multer.File[]).map(
    (file) => `uploads/${file.filename}`,
  );

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

const deleteProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;
  const { productId } = req.params;
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });
  if (!product) {
    throw new CustomError("해당 상품을 찾을 수 없습니다.", 404);
  }
  if (product.authorId !== authorId) {
    throw new CustomError("본인이 등록한 상품이 아닙니다.", 403);
  }
  await prisma.product.delete({
    where: {
      id: Number(productId),
    },
  });
  res.status(200).json({ message: "상품이 삭제되었습니다." });
};

const updateProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;
  const images = (req.files as Express.Multer.File[]).map(
    (file) => `uploads/${file.filename}`,
  );

  const { productId } = req.params;
  const { price, tags, description, name, existingImages }: ProductBodyDto =
    req.body;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });
  if (!product) {
    throw new CustomError("해당 상품을 찾을 수 없습니다.", 404);
  }
  if (product.authorId !== authorId) {
    throw new CustomError("본인이 등록한 상품이 아닙니다.", 403);
  }

  //기존의 유지할 이미지가 없을 경우 undefined가 들어가 .filter 시 에러가 난다 없을 경우 빈배열로 (existingImages ?? []) 만듦
  //악의적인 사람이 existingImages에 아무 이미지나 넣어도 기존의 이미지로 판단 할 수 있기 때문에 validExistingImages로 기존의 이미지가 맞는지 검증
  const validExistingImages = (existingImages ?? []).filter((img) =>
    product.images.includes(img),
  );
  const newImages = images;
  const finalImages = [...validExistingImages, ...newImages];

  if (finalImages.length < 1 || finalImages.length > 3) {
    throw new CustomError("이미지는 최소 1개 이상 3개 이하여야합니다.", 400);
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

const getProductList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { page, pageSize, sort, keyword } = req.validateQuery!;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  //문자열 리터럴 값 뒤에 as const만 붙이면, "insensitive", "desc"가 넓은 string이 아니라 정확히 그 문자열 자체의 타입으로 고정되어서 Prisma가 기대하는 리터럴 타입이랑 맞아떨어진다
  const where = keyword
    ? {
        //insensitive는 영어 검색시 대소문자 구분 X
        name: { contains: keyword, mode: "insensitive" as const },
      }
    : {};
  const sortBy =
    sort === "favorite"
      ? { likeCount: "desc" as const }
      : { createdAt: "desc" as const };

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: sortBy,
      skip,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  res.status(200).json({ list: products, totalProducts });
};

const getProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;

  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });
  if (!product) {
    throw new CustomError("존재하지 않는 상품입니다.", 404);
  }

  let isLiked = false;
  if (authorId) {
    isLiked = !!(await prisma.like.findUnique({
      where: {
        userId_productId: { userId: authorId, productId: Number(productId) },
      },
    }));
  }

  res.status(200).json({ ...product, isLiked });
};

const likeProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;

  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    throw new CustomError("존재하지 않는 상품입니다.", 404);
  }

  const result = await prisma.$transaction([
    prisma.product.update({
      where: { id: Number(productId) },
      data: { likeCount: { increment: 1 } },
    }),
    prisma.like.create({
      data: { userId: authorId, productId: Number(productId) },
    }),
  ]);
  const isLiked = true;

  res.status(200).json({ ...result[0], isLiked });
};

const unlikeProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;

  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    throw new CustomError("존재하지 않는 상품입니다.", 404);
  }

  const result = await prisma.$transaction([
    prisma.product.update({
      where: { id: Number(productId) },
      data: { likeCount: { decrement: 1 } },
    }),
    prisma.like.delete({
      where: {
        userId_productId: { userId: authorId, productId: Number(productId) },
      },
    }),
  ]);
  const isLiked = false;

  res.status(200).json({ ...result[0], isLiked });
};

export default {
  createProduct,
  deleteProduct,
  updateProduct,
  getProductList,
  likeProduct,
  unlikeProduct,
  getProduct,
};
