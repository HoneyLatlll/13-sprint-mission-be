import express from "express";
import productController from "../controllers/product.controller.js";
import verifyAccessToken from "../middlewares/auth.js";

const productRouter = express.Router();

productRouter.post("/", verifyAccessToken, productController.createProduct);

export default productRouter;
