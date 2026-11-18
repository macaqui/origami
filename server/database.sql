CREATE DATABASE IF NOT EXISTS origami_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE origami_db;

CREATE TABLE IF NOT EXISTS hojas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  contenido TEXT NOT NULL,
  categoria ENUM('Desarrollo', 'Base de Datos', 'Estudio', 'Personal') DEFAULT 'Desarrollo',
  prioridad ENUM('Baja', 'Media', 'Alta') DEFAULT 'Media',
  plegada TINYINT(1) DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO hojas (titulo, contenido, categoria, prioridad, plegada) VALUES
('Configurar API en Express', 'Crear rutas GET, POST, PUT y DELETE conectadas a MySQL.', 'Desarrollo', 'Alta', 1),
('Revisar script SQL', 'Verificar tipos de datos ENUM y llave primaria autoincremental.', 'Base de Datos', 'Media', 0),
('Documentar el proyecto', 'Explicar flujo entre React, Express y matriz de pruebas.', 'Estudio', 'Alta', 0);

-- Usuario de la aplicación (evita que el backend se conecte como root).
-- Cambia la contraseña antes de desplegar en un entorno real.
CREATE USER IF NOT EXISTS 'origami'@'localhost' IDENTIFIED BY 'origami123';
GRANT ALL PRIVILEGES ON origami_db.* TO 'origami'@'localhost';

-- Se crea también para 127.0.0.1: en Windows las conexiones TCP llegan con esa
-- IP, así el backend funciona igual si DB_HOST vale localhost o 127.0.0.1.
CREATE USER IF NOT EXISTS 'origami'@'127.0.0.1' IDENTIFIED BY 'origami123';
GRANT ALL PRIVILEGES ON origami_db.* TO 'origami'@'127.0.0.1';

FLUSH PRIVILEGES;
