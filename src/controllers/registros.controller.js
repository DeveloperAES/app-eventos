import { enviarCorreo } from "../utils/mailer.js";
import { pool } from "../config/db.js";
import QRCode from "qrcode";
import crypto from "crypto";

import { BASE_URL } from "../config/env.js";


// Paso 1: Registro sin QR (solo formulario)
export const registrarEnEvento = async (req, res) => {
  try {
    const { usuario_id, evento_id } = req.body;

    if (!usuario_id || !evento_id) {
      return res.status(400).json({ error: "Faltan datos (usuario_id o evento_id)" });
    }

    // Registrar al evento sin QR
    const [result] = await pool.query(
      `INSERT INTO registros (usuario_id, evento_id, estado)
       VALUES (?, ?, 'registrado')`,
      [usuario_id, evento_id]
    );

    res.json({
      ok: true,
      mensaje: "Registro enviado correctamente. Pendiente de confirmación.",
      registro_id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar" });
  }
};


// Paso 2: Confirmación por el administrador
export const confirmarRegistro = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT r.*, u.nombre, u.email, e.nombre AS evento, e.fecha_evento
       FROM registros r
       JOIN usuarios u ON u.id = r.usuario_id
       JOIN eventos e ON e.id = r.evento_id
       WHERE r.id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Registro no encontrado" });

    const registro = rows[0];

    const uniqueCode = crypto.randomUUID();
    const qrURL = `${BASE_URL}/api/registros/validar/${uniqueCode}`;

    // Generar el QR como buffer (imagen binaria)
    const qrBuffer = await QRCode.toBuffer(qrURL);

    // Actualizar BD
    await pool.query(
      `UPDATE registros
       SET qr_code = ?, estado = 'confirmado', fecha_confirmacion = NOW()
       WHERE id = ?`,
      [uniqueCode, id]
    );

    // HTML con la imagen referenciada por cid
    const htmlCorreo = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
        <h2 style="color:#0078D7;">¡Hola ${registro.nombre}!</h2>
        <p>Tu registro al evento <strong>${registro.evento}</strong> ha sido confirmado ✅.</p>
        <p><strong>Fecha del evento:</strong> ${new Date(registro.fecha_evento).toLocaleDateString()}</p>
        <p>Presenta este código QR en la entrada para tu ingreso:</p>
        <div style="text-align:center;">
          <img src="cid:qrimg" alt="QR de acceso" style="width:200px;height:200px;" />
        </div>
        <p style="margin-top:20px;">O puedes usar este enlace directo:</p>
        <a href="${qrURL}" target="_blank">${qrURL}</a>
        <hr>
        <p style="font-size:12px;color:#777;">Correo automático generado por Xplora Eventos</p>
      </div>
    `;

    // Adjuntar el QR con un content-id (cid)
    const enviado = await enviarCorreo(
      registro.email,
      `Confirmación de asistencia - ${registro.evento}`,
      htmlCorreo,
      [
        {
          filename: "qr.png",
          content: qrBuffer,
          cid: "qrimg", // debe coincidir con el src="cid:qrimg"
        },
      ]
    );

    if (!enviado)
      return res.status(500).json({ error: "Error al enviar correo" });

    res.json({
      ok: true,
      mensaje: "Registro confirmado y correo enviado",
      qr_url: qrURL,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al confirmar y enviar correo" });
  }
};

export const listarRegistros = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.id, u.nombre AS usuario, u.email, e.nombre AS evento,
             r.estado, r.qr_code, r.fecha_registro, r.fecha_confirmacion
      FROM registros r
      JOIN usuarios u ON u.id = r.usuario_id
      JOIN eventos e ON e.id = r.evento_id
      ORDER BY r.fecha_registro DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar registros" });
  }
};


export const validarQR = async (req, res) => {
  try {
    const { codigo } = req.params;

    const [rows] = await pool.query(
      `SELECT r.*, u.nombre, u.email, e.nombre AS evento, e.fecha_evento
       FROM registros r
       JOIN usuarios u ON u.id = r.usuario_id
       JOIN eventos e ON e.id = r.evento_id
       WHERE r.qr_code = ?`,
      [codigo]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Código QR no válido o no encontrado",
      });
    }

    const registro = rows[0];

    // Si ya asistió, no volver a marcar
    if (registro.estado === "asistio") {
      return res.json({
        ok: true,
        mensaje: "Este participante ya fue registrado como asistente",
        registro: {
          nombre: registro.nombre,
          evento: registro.evento,
          fecha_evento: registro.fecha_evento,
          estado: registro.estado,
        },
      });
    }

    // Marcar asistencia
    await pool.query(
      `UPDATE registros
       SET estado = 'asistio', fecha_asistencia = NOW()
       WHERE qr_code = ?`,
      [codigo]
    );

    res.json({
      ok: true,
      mensaje: "Asistencia registrada correctamente",
      registro: {
        nombre: registro.nombre,
        evento: registro.evento,
        fecha_evento: registro.fecha_evento,
        estado: "asistio",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error al validar QR" });
  }
};
