import prisma from "../lib/prisma.js";

export const getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await prisma.productComment.findMany({
      where: { productId: Number(productId) },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    res.json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const postProductComments = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await prisma.productComment.create({
      data: {
        ...req.body,
        productId: Number(productId),
      },
    });

    res.status(201).json({ success: true, data: comments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateProductComments = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.productComment.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json({ success: true, data: comment });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "해당 댓글 id가 없음" });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};
