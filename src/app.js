import express from "express";
import "dotenv/config";

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`서버 동작 시작! 포트번호: ${port}`);
});
