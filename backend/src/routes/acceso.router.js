import { Router } from "express";
import { login } from "../controllers/acceso.controller.js";
import { body } from "express-validator";

const router = Router();

const validarLogin = [
  body('email').notEmpty().isEmail().withMessage('Email es requerido'),
  body('password').notEmpty().withMessage('Password es requerida'),
];

router.post("/login", validarLogin, login);

export default router;