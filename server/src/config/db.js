import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// La conexion con prisma
const prisma = new PrismaClient();

// Al arrancar, si no hay nada, meto unas hojas de ejemplo
prisma
  .$connect()
  .then(async () => {
    console.log('Conexión a la base de datos establecida (Prisma + SQLite)');

    const total = await prisma.hoja.count();
    if (total === 0) {
      await prisma.hoja.createMany({
        data: [
          {
            titulo: 'Configurar API en Express',
            contenido: 'Crear rutas GET, POST, PUT y DELETE conectadas a SQLite.',
            categoria: 'Desarrollo',
            prioridad: 'Alta',
            plegada: true
          },
          {
            titulo: 'Revisar el esquema de Prisma',
            contenido: 'Verificar los campos y la llave primaria autoincremental.',
            categoria: 'Base de Datos',
            prioridad: 'Media'
          },
          {
            titulo: 'Documentar el proyecto',
            contenido: 'Escribir el README y las instrucciones de uso.',
            categoria: 'Estudio',
            prioridad: 'Alta'
          }
        ]
      });
      console.log('Se insertaron 3 hojas de ejemplo.');
    }
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error.message);
  });

export default prisma;
