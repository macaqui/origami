import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import hojasRoutes from './routes/hojasRoutes.js';

const app = express();

const carpetaActual = path.dirname(fileURLToPath(import.meta.url));

// Acá revisamos de dónde viene la petición (cors)
const origenesPermitidos = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(cors(origenesPermitidos.length > 0 ? { origin: origenesPermitidos } : {}));
app.use(express.json());

// Ruta para la prueba pa: si esto responde, la api está bien
app.get('/api/health', (req, res) => {
  res.json({ estado: 'OK', proyecto: 'Origami API' });
});

// Las rutas de las hojas
app.use('/api/hojas', hojasRoutes);

// Si ya está compilado el front lo muestro desde acá
const carpetaCliente = path.resolve(carpetaActual, '../../client/dist');
const hayInterfazCompilada = fs.existsSync(path.join(carpetaCliente, 'index.html'));

if (hayInterfazCompilada) {
  app.use(express.static(carpetaCliente));
}

// Si no existe la ruta
app.use((req, res) => {
  res.status(404).json({
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Por si algo revienta
app.use((error, req, res, next) => {
  console.error('Error no controlado:', error);
  res.status(error.status || 500).json({
    mensaje: error.message || 'Error interno del servidor'
  });
});

export default app;
