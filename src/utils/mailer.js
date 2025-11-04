import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // true para 465, false para otros puertos (TLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false
    }
});

export async function enviarCorreo(destinatario, asunto, html, attachments = []) {
    try {
        const info = await transporter.sendMail({
            from: `"Xplora Eventos" <${process.env.SMTP_USER}>`,
            to: destinatario,
            subject: asunto,
            html,
            attachments,
        });
        console.log("📨 Correo enviado:", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Error enviando correo:", error);
        return false;
    }
}
