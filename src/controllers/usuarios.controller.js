import { pool } from '../config/db.js';

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    if (!nombre || !email)
      return res.status(400).json({ error: 'Faltan campos requeridos' });

    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, telefono) VALUES (?, ?, ?)',
      [nombre, email, telefono]
    );

    res.json({ ok: true, usuario_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
