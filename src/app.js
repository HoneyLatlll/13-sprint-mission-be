import express from "express";
import "dotenv/config";
import userRouter from "./routes/user.router.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/users", userRouter);

app.use(errorHandler);

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`서버 동작 시작! 포트번호: ${port}`);
});
