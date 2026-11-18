// La URL del backend se configura con la variable VITE_API_URL del archivo .env
// (ver client/.env.example). Si no está definida, se usa localhost por defecto,
// de modo que cambiar el puerto o el dominio no obliga a tocar el código.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/hojas';

export const listarHojas = async () => {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) throw new Error('No se pudieron cargar las hojas');
  return respuesta.json();
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
