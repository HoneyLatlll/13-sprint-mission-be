import express from "express";
import dotenv from "dotenv";
import ProductRouter from "./routes/products.router.js";
import ArticleRouter from "./routes/articles.router.js";
import ProductCommentRouter from "./routes/product-comments.router.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/products", ProductRouter);
app.use("/articles", ArticleRouter);
app.use("/products/:id/comments", ProductCommentRouter);
// app.use("/articles/:id/comments",ArticleCommentRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 동작 중`);
});
