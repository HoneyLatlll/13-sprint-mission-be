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

  //기존의 유지할 이미지가 없을 경우 undefined가 들어가 .filter 시 에러가 난다 없을 경우 빈배열로 (existingImages ?? []) 만듦
  //악의적인 사람이 existingImages에 아무 이미지나 넣어도 기존의 이미지로 판단 할 수 있기 때문에 validExistingImages로 기존의 이미지가 맞는지 검증
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

const getProductList = async (req, res, next) => {
  const { page, pageSize, sort, keyword } = req.validateQuery;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const where = keyword
    ? {
        //insensitive는 영어 검색시 대소문자 구분 X
        name: { contains: keyword, mode: "insensitive" },
      }
    : {};
  const sortBy =
    sort === "favorite" ? { likeCount: "desc" } : { createdAt: "desc" };

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

const likeProduct = async (req, res, next) => {
  const { productId } = req.params;
  const authorId = req.auth.userId;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    const error = new Error("존재하지 않는 상품입니다.");
    error.code = 404;
    return next(error);
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

const unlikeProduct = async (req, res, next) => {
  const { productId } = req.params;
  const authorId = req.auth.userId;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    const error = new Error("존재하지 않는 상품입니다.");
    error.code = 404;
    return next(error);
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
};
