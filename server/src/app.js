import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import hojasRoutes from './routes/hojasRoutes.js';

const app = express();

const carpetaActual = path.dirname(fileURLToPath(import.meta.url));

// Orígenes permitidos para CORS (separados por coma).
// Si la variable está vacía se permite cualquier origen (solo desarrollo).
const origenesPermitidos = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(cors(origenesPermitidos.length > 0 ? { origin: origenesPermitidos } : {}));
app.use(express.json());

// Ruta de verificación de estado
app.get('/api/health', (req, res) => {
  res.json({ estado: 'OK', proyecto: 'Origami API' });
});

// Rutas principales
app.use('/api/hojas', hojasRoutes);

// Sirve la interfaz compilada (client/dist) cuando existe.
// Con esto la interfaz y la API pueden vivir en el MISMO servicio y el mismo
// origen: se abre una sola URL y no hay que configurar CORS.
// En desarrollo (Vite en el puerto 5173) esta carpeta no existe y no pasa nada.
const carpetaCliente = path.resolve(carpetaActual, '../../client/dist');
const hayInterfazCompilada = fs.existsSync(path.join(carpetaCliente, 'index.html'));

if (hayInterfazCompilada) {
  app.use(express.static(carpetaCliente));
}

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Middleware central de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no controlado:', error);
  res.status(error.status || 500).json({
    mensaje: error.message || 'Error interno del servidor'
  });
});

export default app;
