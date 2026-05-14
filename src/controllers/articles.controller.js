import prisma from "../lib/prisma.js";

export const getAllArticles = async (req, res) => {
  try {
    const { keyword, sort = "latest", page = "1", limit = "5" } = req.query;

    const where = {};

    if (keyword) {
      // where["title"] = { contains: keyword }; 아래와 같음
      where.title = { contains: keyword };
    }

    const orderBy = {
      latest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      title: { title: "asc" },
    }[sort] || { createdAt: "desc" };

    const pageNum = Number(page) || 1;
    const take = Number(limit) || 5;
    const skip = (pageNum - 1) * take;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({ where, orderBy, skip, take }),
      prisma.article.count({ where }),
    ]);

    res.json({
      success: true,
      data: articles,
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
