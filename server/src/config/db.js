import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Cliente único de Prisma. Toda la aplicación consulta la base de datos por aquí.
const prisma = new PrismaClient();

// Prueba la conexión al arrancar para detectar errores de configuración rápido.
prisma
  .$connect()
  .then(() => {
    console.log('Conexión a la base de datos establecida (Prisma + MySQL)');
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error.message);
  });

export default prisma;
