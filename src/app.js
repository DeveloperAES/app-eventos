import express from "express";
import cors from "cors";
import { pool } from "./config/db.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import eventosRoutes from "./routes/eventos.routes.js";
import registrosRoutes from "./routes/registros.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas base
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/eventos", eventosRoutes);
app.use("/api/registros", registrosRoutes);

// Test de conexión
app.get("/api", async (req, res) => {
  const [rows] = await pool.query("SELECT NOW() as time");
  res.json({ ok: true, server_time: rows[0].time });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
