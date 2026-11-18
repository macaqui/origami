CREATE DATABASE IF NOT EXISTS origami_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE origami_db;

CREATE TABLE IF NOT EXISTS hojas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  contenido TEXT NOT NULL,
  -- Los valores permitidos se validan en la capa de la API (hojasController.js).
  -- Se usan VARCHAR (y no ENUM) porque Prisma mapea estos campos como String.
  categoria VARCHAR(50) DEFAULT 'Desarrollo',
  prioridad VARCHAR(20) DEFAULT 'Media',
  plegada TINYINT(1) DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asegura los tipos de datos aunque la tabla ya existiera de antes.
ALTER TABLE hojas
  MODIFY categoria VARCHAR(50) DEFAULT 'Desarrollo',
  MODIFY prioridad VARCHAR(20) DEFAULT 'Media';

INSERT INTO hojas (titulo, contenido, categoria, prioridad, plegada) VALUES
('Configurar API en Express', 'Crear rutas GET, POST, PUT y DELETE conectadas a MySQL.', 'Desarrollo', 'Alta', 1),
('Revisar script SQL', 'Verificar los tipos de datos y la llave primaria autoincremental.', 'Base de Datos', 'Media', 0),
('Documentar el proyecto', 'Escribir el README y las instrucciones de uso.', 'Estudio', 'Alta', 0);

-- Usuario de la aplicación (evita que el backend se conecte como root).
-- Cambia la contraseña antes de desplegar en un entorno real.
CREATE USER IF NOT EXISTS 'origami'@'localhost' IDENTIFIED BY 'origami123';
GRANT ALL PRIVILEGES ON origami_db.* TO 'origami'@'localhost';

-- Se crea también para 127.0.0.1: en Windows las conexiones TCP llegan con esa
-- IP, así el backend funciona igual si DB_HOST vale localhost o 127.0.0.1.
CREATE USER IF NOT EXISTS 'origami'@'127.0.0.1' IDENTIFIED BY 'origami123';
GRANT ALL PRIVILEGES ON origami_db.* TO 'origami'@'127.0.0.1';

FLUSH PRIVILEGES;
