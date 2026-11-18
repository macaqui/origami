// URL del backend. Se puede cambiar con la variable VITE_API_URL del archivo
// .env (ver client/.env.example). Si no está definida: en desarrollo se usa
// localhost:3001 y en producción la ruta relativa /api/hojas, porque ahí
// Express sirve la interfaz y comparte el mismo origen.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/hojas' : 'http://localhost:3001/api/hojas');

export const listarHojas = async () => {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) throw new Error('No se pudieron cargar las hojas');
  return respuesta.json();
};

// Obtiene una sola hoja por su id.
export const obtenerHoja = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`);
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.mensaje || 'No se pudo obtener la hoja');
  return data;
};

export const crearHoja = async (datos) => {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.mensaje || 'Error al crear la hoja');
  return data;
};

export const actualizarHoja = async (id, datos) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.mensaje || 'Error al actualizar la hoja');
  return data;
};

export const eliminarHoja = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  const data = await respuesta.json();
  if (!respuesta.ok) throw new Error(data.mensaje || 'Error al eliminar la hoja');
  return data;
};
