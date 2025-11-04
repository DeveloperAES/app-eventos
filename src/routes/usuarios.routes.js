import express from "express";
import { registrarUsuario } from "../controllers/usuarios.controller.js";

const router = express.Router();

router.post("/registrar", registrarUsuario);

export default router;
