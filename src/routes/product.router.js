import express from "express";
import productController from "../controllers/product.controller.js";
import auth from "../middlewares/auth.js";
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
  auth.verifyAccessToken,
  upload.array("images", 3),
  validateProduct.validateCreateProduct,
  productController.createProduct,
);

productRouter.delete(
  "/:productId",
  auth.verifyAccessToken,
  productController.deleteProduct,
);

productRouter.patch(
  "/:productId",
  auth.verifyAccessToken,
  upload.array("images", 3),
  validateProduct.validateUpdateProduct,
  productController.updateProduct,
);

productRouter.get(
  "/",
  validateProduct.validateGetProductList,
  productController.getProductList,
);
productRouter.get(
  "/:productId",
  auth.optionalAccessToken,
  productController.getProduct,
);

productRouter.post(
  "/:productId/like",
  auth.verifyAccessToken,
  productController.likeProduct,
);

productRouter.delete(
  "/:productId/like",
  auth.verifyAccessToken,
  productController.unlikeProduct,
);

export default productRouter;
