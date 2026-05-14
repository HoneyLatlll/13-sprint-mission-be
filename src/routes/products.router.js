import express from "express";

const ProductRouter = express.Router();

ProductRouter.get("/", (req, res) => {
  res.json("상품 목록");
});

export default ProductRouter;
