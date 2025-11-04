import { pool } from "../config/db.js";

export const crearEvento = async (req, res) => {
  try {
    const { nombre, descripcion, fecha_evento, latitud, longitud, radio_metros } = req.body;

    if (!nombre || !fecha_evento) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const [result] = await pool.query(
      `INSERT INTO eventos (nombre, descripcion, fecha_evento, latitud, longitud, radio_metros)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, fecha_evento, latitud, longitud, radio_metros || 100]
    );

    res.json({ ok: true, evento_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando el evento" });
  }
};

export const listarEventos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM eventos ORDER BY fecha_evento DESC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar eventos" });
  }
};
