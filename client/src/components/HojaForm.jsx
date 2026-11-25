import { useState } from 'react';

// Cuando edito cargo los datos de la hoja
function HojaForm({ onGuardar, hojaEditando, onCancelarEdicion }) {
  const [titulo, setTitulo] = useState(hojaEditando?.titulo ?? '');
  const [contenido, setContenido] = useState(hojaEditando?.contenido ?? '');
  const [categoria, setCategoria] = useState(hojaEditando?.categoria ?? 'Desarrollo');
  const [prioridad, setPrioridad] = useState(hojaEditando?.prioridad ?? 'Media');
  const [errorForm, setErrorForm] = useState('');

  const limpiarCampos = () => {
    setTitulo('');
    setContenido('');
    setCategoria('Desarrollo');
    setPrioridad('Media');
    setErrorForm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || !contenido.trim()) {
      setErrorForm('Por favor completa el título y el contenido de la hoja.');
      return;
    }

    await onGuardar({
      titulo,
      contenido,
      categoria,
      prioridad,
      plegada: hojaEditando ? hojaEditando.plegada : false
    });

    if (!hojaEditando) {
      limpiarCampos();
    }
  };

  return (
    <form className="origami-form" onSubmit={handleSubmit}>
      <h2>{hojaEditando ? 'Editar Hoja' : 'Nueva Hoja'}</h2>

      {errorForm && <p className="alerta-error">{errorForm}</p>}

      <label>
        Título
        <input
          type="text"
          placeholder="Ej. Configurar rutas en Express"
          maxLength={120}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </label>

      <div className="fila-selects">
        <label>
          Categoría
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="Desarrollo">Desarrollo</option>
            <option value="Base de Datos">Base de Datos</option>
            <option value="Estudio">Estudio</option>
            <option value="Personal">Personal</option>
          </select>
        </label>

        <label>
          Prioridad
          <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </label>
      </div>

      <label>
        Contenido
        <textarea
          rows="4"
          placeholder="Escribe los detalles o pasos de esta nota..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />
      </label>

      <div className="acciones-form">
        <button type="submit" className="btn-primario">
          {hojaEditando ? 'Guardar Cambios' : 'Crear Hoja'}
        </button>

        {hojaEditando && (
          <button
            type="button"
            className="btn-secundario"
            onClick={onCancelarEdicion}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default HojaForm;
