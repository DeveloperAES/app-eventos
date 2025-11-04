import { pool } from '../config/db.js';

const corporativoRegex = /^[a-zA-Z0-9._%+-]+@(?!gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


export const registrarUsuario = async (req, res) => {
  try {
    const { dni, nombres, apellidos, email, telefono, empresa } = req.body;

    // Validar campos obligatorios
    if (!dni || !nombres || !apellidos || !email || !telefono || !empresa) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    // Validar formato de correo
    if (!corporativoRegex.test(email)) {
      return res.status(400).json({
        error: "Solo se permiten correos corporativos (no Gmail, Hotmail, etc.)",
      });
    }

    // Insertar en BD
    const [result] = await pool.query(
      `INSERT INTO usuarios (dni, nombres, apellidos, email, telefono, empresa)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [dni, nombres, apellidos, email, telefono, empresa]
    );

    res.json({
      ok: true,
      mensaje: "Usuario registrado correctamente.",
      usuario_id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "El DNI o correo ya está registrado." });
    }

    res.status(500).json({ error: "Error al registrar el usuario." });
  }
};
