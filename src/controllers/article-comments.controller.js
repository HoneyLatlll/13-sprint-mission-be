import prisma from "../lib/prisma.js";

export const getArticleComments = async (req, res) => {
  const { articleId } = req.params;
  const { limit = 3, cursor } = req.query;

  const comments = await prisma.articleComment.findMany({
    where: { articleId: Number(articleId) },
    take: Number(limit) + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: Number(cursor) } : undefined,
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const nextCursor =
    comments.length === Number(limit) + 1 //댓글의 수가 limit을 넘었을 때
      ? comments[comments.length - 1].id
      : null;

  res.json({
    success: true,
    data: comments.slice(0, Number(limit)), //limit수 만큼 반환해야해서
    nextCursor,
  });
};

export const postArticleComments = async (req, res) => {
  const { articleId } = req.params;

  const comments = await prisma.articleComment.create({
    data: {
      ...req.body,
      articleId: Number(articleId),
    },
  });

  res.status(201).json({ success: true, data: comments });
};

export const updateArticleComments = async (req, res) => {
  const { id } = req.params;

  const comment = await prisma.articleComment.update({
    where: { id: Number(id) },
    data: req.body,
  });
  res.json({ success: true, data: comment });
};

export const deleteArticleComments = async (req, res) => {
  const { id } = req.params;

  await prisma.articleComment.delete({
    where: { id: Number(id) },
  });
  res.json({ success: true, message: "댓글이 정상적으로 삭제 되었습니다" });
};
