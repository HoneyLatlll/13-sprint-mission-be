import express from "express";
import dotenv from "dotenv";
import ProductRouter from "./routes/products.router.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/products", ProductRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 동작 중`);
});
