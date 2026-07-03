import express from "express";
import "dotenv/config";
import userRouter from "./routes/user.router.js";
import errorHandler from "./middlewares/errorHandler.js";
import productRouter from "./routes/product.router.js";

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/products", productRouter);

app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`서버 동작 시작! 포트번호: ${port}`);
});
