import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'origami_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Verificación inicial de conexión para detectar errores rápido
pool.getConnection()
  .then((connection) => {
    console.log('✅ Conexión exitosa a MySQL (origami_db)');
    connection.release();
  })
  .catch((error) => {
    console.error('❌ Error conectando a MySQL:', error.message);
  });

export default pool;
