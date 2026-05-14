import express from "express";
import { getProducts } from "../controllers/products.controller.js";

const ProductRouter = express.Router();

ProductRouter.get("/", getProducts);

export default ProductRouter;
