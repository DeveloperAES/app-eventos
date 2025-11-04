import express from "express";
import { crearEvento, listarEventos } from "../controllers/eventos.controller.js";

const router = express.Router();

router.post("/crear", crearEvento);
router.get("/", listarEventos);

export default router;
