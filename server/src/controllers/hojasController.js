import prisma from '../config/db.js';

const CATEGORIAS_VALIDAS = ['Desarrollo', 'Base de Datos', 'Estudio', 'Personal'];
const PRIORIDADES_VALIDAS = ['Baja', 'Media', 'Alta'];

// Convierte el valor recibido de "plegada" a booleano.
// null significa "no modificar el valor actual" (no vino en la petición).
const normalizarPlegada = (valor) => {
  if (valor === undefined || valor === null) return null;
  return valor === true || valor === 1 || valor === '1' || valor === 'true';
};

// Valida que el id de la URL sea un entero positivo.
const idValido = (valor) => {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// GET /api/hojas - Listar todas las hojas
export const obtenerHojas = async (req, res) => {
  try {
    const hojas = await prisma.hoja.findMany({
      orderBy: [{ plegada: 'asc' }, { fecha_creacion: 'desc' }]
    });
    res.status(200).json(hojas);
  } catch (error) {
    console.error('Error en obtenerHojas:', error);
    res.status(500).json({ mensaje: 'Error interno al consultar las hojas' });
  }
};

// GET /api/hojas/:id - Obtener una hoja por su id
export const obtenerHojaPorId = async (req, res) => {
  try {
    const id = idValido(req.params.id);
    if (id === null) {
      return res.status(404).json({ mensaje: 'Hoja no encontrada' });
    }

    const hoja = await prisma.hoja.findUnique({ where: { id } });
    if (!hoja) {
      return res.status(404).json({ mensaje: 'Hoja no encontrada' });
    }

    res.status(200).json(hoja);
  } catch (error) {
    console.error('Error en obtenerHojaPorId:', error);
    res.status(500).json({ mensaje: 'Error interno al consultar la hoja' });
  }
};

// POST /api/hojas - Crear una nueva hoja
export const crearHoja = async (req, res) => {
  try {
    const { titulo, contenido, categoria, prioridad } = req.body;

    if (!titulo || !titulo.trim() || !contenido || !contenido.trim()) {
      return res.status(400).json({
        mensaje: 'El título y el contenido son obligatorios.'
      });
    }

    const hoja = await prisma.hoja.create({
      data: {
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        categoria: CATEGORIAS_VALIDAS.includes(categoria) ? categoria : 'Desarrollo',
        prioridad: PRIORIDADES_VALIDAS.includes(prioridad) ? prioridad : 'Media'
      }
    });

    res.status(201).json(hoja);
  } catch (error) {
    console.error('Error en crearHoja:', error);
    res.status(500).json({ mensaje: 'Error interno al crear la hoja' });
  }
};

// PUT /api/hojas/:id - Actualizar una hoja
export const actualizarHoja = async (req, res) => {
  try {
    const id = idValido(req.params.id);
    if (id === null) {
      return res.status(404).json({ mensaje: 'Hoja no encontrada' });
    }

    const { titulo, contenido, categoria, prioridad, plegada } = req.body;

    if (!titulo || !titulo.trim() || !contenido || !contenido.trim()) {
      return res.status(400).json({
        mensaje: 'El título y el contenido no pueden quedar vacíos.'
      });
    }

    const existe = await prisma.hoja.findUnique({ where: { id } });
    if (!existe) {
      return res.status(404).json({ mensaje: 'Hoja no encontrada' });
    }

    const datos = {
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      categoria: CATEGORIAS_VALIDAS.includes(categoria) ? categoria : 'Desarrollo',
      prioridad: PRIORIDADES_VALIDAS.includes(prioridad) ? prioridad : 'Media'
    };

    // Solo se modifica "plegada" si el cliente lo envió.
    const plegadaNormalizada = normalizarPlegada(plegada);
    if (plegadaNormalizada !== null) {
      datos.plegada = plegadaNormalizada;
    }

    const hoja = await prisma.hoja.update({ where: { id }, data: datos });
    res.status(200).json(hoja);
  } catch (error) {
    console.error('Error en actualizarHoja:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar la hoja' });
  }
};

// DELETE /api/hojas/:id - Eliminar una hoja
export const eliminarHoja = async (req, res) => {
  try {
    const id = idValido(req.params.id);
    if (id === null) {
      return res.status(404).json({ mensaje: 'Hoja no encontrada' });
    }

    const existe = await prisma.hoja.findUnique({ where: { id } });
    if (!existe) {
      return res.status(404).json({ mensaje: 'Hoja no encontrada' });
    }

    await prisma.hoja.delete({ where: { id } });
    res.status(200).json({ mensaje: 'Hoja eliminada correctamente' });
  } catch (error) {
    console.error('Error en eliminarHoja:', error);
    res.status(500).json({ mensaje: 'Error interno al eliminar la hoja' });
  }
};
