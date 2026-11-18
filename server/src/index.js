import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3001;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor Origami escuchando en http://localhost:${PORT}`);
});

// Aviso claro si el puerto ya está ocupado (pasa si quedó otro servidor abierto
// o si otro programa del equipo usa el mismo puerto).
servidor.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya está ocupado por otro programa.`);
    console.error('Cierra ese programa, o cambia PORT en server/.env y vuelve a intentarlo.');
  } else {
    console.error('No se pudo iniciar el servidor:', error.message);
  }
  process.exit(1);
});
