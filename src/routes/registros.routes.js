import express from "express";
import {
  registrarEnEvento,
  confirmarRegistro,
  validarQR,
  listarRegistros,
  reenviarRecordatorios
} from "../controllers/registros.controller.js";

const router = express.Router();

router.post("/registrar", registrarEnEvento);
router.post("/confirmar/:id", confirmarRegistro);
router.get("/validar/:codigo", validarQR);
router.get("/listar", listarRegistros);
router.post("/reenviar-recordatorios", reenviarRecordatorios);

export default router;
