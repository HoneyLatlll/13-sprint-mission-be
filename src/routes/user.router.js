import express from "express";
import userController from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/", userController.createUser);
userRouter.get("/me", auth.verifyAccessToken, userController.getUser);
userRouter.post("/login", userController.loginUser);

export default userRouter;
