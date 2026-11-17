import pool from '../config/db.js';

const CATEGORIAS_VALIDAS = ['Desarrollo', 'Base de Datos', 'Estudio', 'Personal'];
const PRIORIDADES_VALIDAS = ['Baja', 'Media', 'Alta'];

// Normaliza el campo "plegada": null significa "no modificar el valor actual".
const normalizarPlegada = (valor) => {
  if (valor === undefined || valor === null) return null;
  return valor === true || valor === 1 || valor === '1' || valor === 'true' ? 1 : 0;
};

// GET /api/hojas - Listar todas las hojas
export const obtenerHojas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM hojas ORDER BY plegada ASC, fecha_creacion DESC'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error en obtenerHojas:', error);
    res.status(500).json({ mensaje: 'Error interno al consultar las hojas' });
  }
};

// GET /api/hojas/:id - Obtener una hoja por su id
export const obtenerHojaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM hojas WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Hoja no encontrada' });
    }

    res.status(200).json(rows[0]);
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

    const catFinal = CATEGORIAS_VALIDAS.includes(categoria) ? categoria : 'Desarrollo';
    const prioFinal = PRIORIDADES_VALIDAS.includes(prioridad) ? prioridad : 'Media';

    const [result] = await pool.query(
      'INSERT INTO hojas (titulo, contenido, categoria, prioridad) VALUES (?, ?, ?, ?)',
      [titulo.trim(), contenido.trim(), catFinal, prioFinal]
    );

    const [nuevaHoja] = await pool.query('SELECT * FROM hojas WHERE id = ?', [
      result.insertId
    ]);

    res.status(201).json(nuevaHoja[0]);
  } catch (error) {
    console.error('Error en crearHoja:', error);
    res.status(500).json({ mensaje: 'Error interno al crear la hoja' });
  }
};

// PUT /api/hojas/:id - Actualizar contenido o estado de plegado
export const actualizarHoja = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, categoria, prioridad, plegada } = req.body;

    if (!titulo || !titulo.trim() || !contenido || !contenido.trim()) {
      return res.status(400).json({
        mensaje: 'El título y el contenido no pueden quedar vacíos.'
      });
    }

    const catFinal = CATEGORIAS_VALIDAS.includes(categoria) ? categoria : 'Desarrollo';
    const prioFinal = PRIORIDADES_VALIDAS.includes(prioridad) ? prioridad : 'Media';

    // COALESCE deja intacto el valor actual si el cliente no envía "plegada".
    const [result] = await pool.query(
      `UPDATE hojas
       SET titulo = ?, contenido = ?, categoria = ?, prioridad = ?, plegada = COALESCE(?, plegada)
       WHERE id = ?`,
      [titulo.trim(), contenido.trim(), catFinal, prioFinal, normalizarPlegada(plegada), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Hoja no encontrada' });
    }

    const [hojaActualizada] = await pool.query('SELECT * FROM hojas WHERE id = ?', [id]);
    res.status(200).json(hojaActualizada[0]);
  } catch (error) {
    console.error('Error en actualizarHoja:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar la hoja' });
  }
};

// DELETE /api/hojas/:id - Eliminar una hoja
export const eliminarHoja = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM hojas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Hoja no encontrada' });
    }

    res.status(200).json({ mensaje: 'Hoja eliminada correctamente' });
  } catch (error) {
    console.error('Error en eliminarHoja:', error);
    res.status(500).json({ mensaje: 'Error interno al eliminar la hoja' });
  }
};
