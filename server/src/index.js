import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3001;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor Origami escuchando en http://localhost:${PORT}`);
});

// Por si el puerto ya está ocupado
servidor.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya está ocupado.`);
    console.error('Cierra el otro programa o cambia PORT en server/.env');
  } else {
    console.error('No se pudo iniciar el servidor:', error.message);
  }
  process.exit(1);
});
