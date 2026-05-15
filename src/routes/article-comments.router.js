import express from "express";
import {
  deleteArticleComments,
  getArticleComments,
  postArticleComments,
  updateArticleComments,
} from "../controllers/article-comments.controller.js";

const ArticleCommentRouter = express.Router({ mergeParams: true });

ArticleCommentRouter.get("/", getArticleComments);

ArticleCommentRouter.post("/", postArticleComments);

ArticleCommentRouter.patch("/:id", updateArticleComments);

ArticleCommentRouter.delete("/:id", deleteArticleComments);

export default ArticleCommentRouter;
