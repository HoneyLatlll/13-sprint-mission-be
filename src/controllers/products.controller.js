import prisma from "../lib/prisma.js";

export const getAllProducts = async (req, res) => {
  try {
    const { page = "1", limit = "10", sort = "latest", keyword } = req.query;

    const where = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }

    const orderBy = {
      latest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      name: { name: "asc" },
    }[sort] || { createdAt: "desc" };

    const pageNum = Number(page) || 1;
    const take = Number(limit) || 10;
    const skip = (pageNum - 1) * take;

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "없는 id임" });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const postProduct = async (req, res) => {
  try {
    const { name, price, description, tags } = req.body;

    const product = await prisma.product.create({
      data: { name, price, description, tags },
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json({ success: true, data: product });
  } catch (err) {
    //update는 해당 id를 못찾으면 prisma가 자동으로 error를 던지기 때문에 catch에서 잡는것이 자연스러움
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "해당 id의 게시물을 찾을 수 없음" });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.json({ success: true, message: "정상적으로 삭제되었습니다" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "없는 id" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};
