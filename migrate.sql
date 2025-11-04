CREATE DATABASE eventos_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eventos_app;

-- 1️⃣ Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE,
  telefono VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ Tabla de eventos
CREATE TABLE eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  fecha_evento DATETIME NOT NULL,
  latitud DECIMAL(10,8),
  longitud DECIMAL(11,8),
  radio_metros INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ Tabla de registros (inscripciones al evento)
CREATE TABLE registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  evento_id INT NOT NULL,
  qr_code VARCHAR(255) UNIQUE,
  estado ENUM('registrado','confirmado','asistio','fuera') DEFAULT 'registrado',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_confirmacion DATETIME,
  fecha_asistencia DATETIME NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (evento_id) REFERENCES eventos(id)
);

-- 4️⃣ Tabla para coordenadas o tracking de ubicación
CREATE TABLE ubicaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registro_id INT NOT NULL,
  latitud DECIMAL(10,8),
  longitud DECIMAL(11,8),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registro_id) REFERENCES registros(id)
);
