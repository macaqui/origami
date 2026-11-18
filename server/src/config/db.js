import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Cliente único de Prisma (ORM). Todas las consultas a MySQL/MariaDB pasan por
// aquí, así que no hay SQL escrito a mano en los controladores.
const prisma = new PrismaClient();

// Verificación inicial de conexión para detectar errores rápido.
prisma
  .$connect()
  .then(() => {
    console.log('✅ Conexión exitosa a MySQL (origami_db) vía Prisma');
  })
  .catch((error) => {
    console.error('❌ Error conectando a MySQL:', error.message);
  });

export default prisma;
