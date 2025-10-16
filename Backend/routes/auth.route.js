import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { arcjetProtect } from "../middlewares/arcjet.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related APIs
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Creates a new user account with full name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request — invalid data or email already exists
 *       500:
 *         description: Server error
 */
router.post("/signup", arcjetProtect, signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a new user
 *     tags: [Auth]
 *     description: login a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: User login success
 *       400:
 *         description: Bad request — invalid data or email already exists
 *       500:
 *         description: Server error
 */
router.post("/login", arcjetProtect, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: logout a user
 *     tags: [Auth]
 *     description: logout a user.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: User logout successfully
 
 *       500:
 *         description: Server error
 */
router.post("/logout", arcjetProtect, logout);

/**
 * @swagger
 * /api/auth/update-profile:
 *   post:
 *     summary: Update a user profile
 *     tags: [Auth]
 *     description: Update a user profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: User login success
 *       400:
 *         description: Bad request — invalid data or email already exists
 *       500:
 *         description: Server error
 */
router.post("/update-profile", arcjetProtect, authUser, updateProfile);

export default router;
