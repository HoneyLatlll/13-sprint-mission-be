import express from "express";
import productController from "../controllers/product.controller.js";
import verifyAccessToken from "../middlewares/auth.js";
import multer from "multer";
import path from "path";
import validateProduct from "../middlewares/validators/product.validator.js";
import crypto from "crypto";

const productRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    //crypto.randomUUID()로 이미지 동시 업로드시 파일명 겹치는 경우 해결
    cb(null, `${crypto.randomUUID()}_${fileExt}`);
  },
});
const upload = multer({ storage });
productRouter.post(
  "/",
  verifyAccessToken,
  upload.array("images", 3),
  validateProduct.validateCreateProduct,
  productController.createProduct,
);

productRouter.delete(
  "/:productId",
  verifyAccessToken,
  productController.deleteProduct,
);

productRouter.patch(
  "/:productId",
  verifyAccessToken,
  upload.array("images", 3),
  validateProduct.validateUpdateProduct,
  productController.updateProduct,
);

productRouter.get("/", productController.getProductList);

export default productRouter;
