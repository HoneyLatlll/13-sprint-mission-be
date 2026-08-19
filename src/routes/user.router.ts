import express from "express";
import userController from "../controllers/user.controller";
import auth from "../middlewares/auth";

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 회원가입
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: 판다
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password1234
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 필수값 누락
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.post("/", userController.createUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 로그인한 유저 정보 조회
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패 (토큰 없음/유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get("/me", auth.verifyAccessToken, userController.getUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: 로그인
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password1234
 *     responses:
 *       200:
 *         description: 로그인 성공, 액세스 토큰 발급
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userData:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: 필수값 누락
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 이메일 또는 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.post("/login", userController.loginUser);

/**
 * @swagger
 * /users/refresh:
 *   post:
 *     summary: 액세스 토큰 재발급
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: 리프레시 토큰 없음/유효하지 않음/DB 저장값과 불일치
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.post("/refresh", userController.refreshToken);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공, DB에 저장된 refreshToken 제거
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증 실패 (accessToken 없음/유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.post("/logout", auth.verifyAccessToken, userController.logoutUser);

export default userRouter;
