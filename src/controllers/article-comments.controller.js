import prisma from "../lib/prisma.js";

export const getArticleComments = async (req, res) => {
  try {
    const { articleId } = req.params;

    const comments = await prisma.articleComment.findMany({
      where: { articleId: Number(articleId) },
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

export const postArticleComments = async (req, res) => {
  try {
    const { articleId } = req.params;

    const comments = await prisma.articleComment.create({
      data: {
        ...req.body,
        articleId: Number(articleId),
      },
    });

    res.status(201).json({ success: true, data: comments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateArticleComments = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.articleComment.update({
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

export const deleteArticleComments = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.articleComment.delete({
      where: { id: Number(id) },
    });
    res.json({ success: true, message: "댓글이 정상적으로 삭제 되었습니다" });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "없는 댓글 id입니다." });
    }

    res.status(500).json({ success: false, message: err.message });
  }
};
