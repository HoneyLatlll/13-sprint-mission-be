import express from "express";
import productController from "../controllers/product.controller.js";
import verifyAccessToken from "../middlewares/auth.js";
import multer from "multer";
import path from "path";

const productRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    cb(null, `${Date.now()}_${fileExt}`);
  },
});
const upload = multer({ storage });
productRouter.post(
  "/",
  verifyAccessToken,
  upload.array("images", 3),
  productController.createProduct,
);

export default productRouter;
