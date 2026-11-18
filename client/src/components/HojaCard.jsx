function HojaCard({ hoja, onTogglePlegar, onEditar, onEliminar, onVer }) {
  const estaPlegada = Boolean(hoja.plegada);
  const fechaFormateada = new Date(hoja.fecha_creacion).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <article className={`hoja-card ${estaPlegada ? 'plegada' : ''}`}>
      <div className="hoja-header">
        <span className="badge-categoria">{hoja.categoria}</span>
        <span className={`badge-prioridad prio-${hoja.prioridad.toLowerCase()}`}>
          {hoja.prioridad}
        </span>
      </div>

      <h3>{hoja.titulo}</h3>
      <p className="hoja-contenido">{hoja.contenido}</p>

      <div className="hoja-footer">
        <small className="hoja-fecha">{fechaFormateada}</small>
        <div className="hoja-botones">
          <button
            type="button"
            className="btn-plegar"
            onClick={() => onTogglePlegar(hoja)}
          >
            {estaPlegada ? 'Desplegar' : 'Plegar'}
          </button>
          <button
            type="button"
            className="btn-ver"
            onClick={() => onVer(hoja)}
          >
            Ver 3D
          </button>
          <button
            type="button"
            className="btn-editar"
            onClick={() => onEditar(hoja)}
          >
            Editar
          </button>
          <button
            type="button"
            className="btn-eliminar"
            onClick={() => onEliminar(hoja.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}

export default HojaCard;
