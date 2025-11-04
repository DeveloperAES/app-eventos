import express from "express";
import {
  registrarEnEvento,
  confirmarRegistro,
  validarQR,
  listarRegistros
} from "../controllers/registros.controller.js";

const router = express.Router();

router.post("/registrar", registrarEnEvento);
router.post("/confirmar/:id", confirmarRegistro);
router.get("/validar/:codigo", validarQR);
router.get("/listar", listarRegistros);

export default router;
