import GrullaPlegable from './GrullaPlegable';

// Contenido del modal "Ver 3D": a la izquierda la grulla de origami (que se
// pliega y despliega al hacer clic) y a la derecha los datos de la hoja.
function Origami3D({ hoja }) {
  const plegada = Boolean(hoja?.plegada);
  const prioridad = hoja?.prioridad || 'Media';

  return (
    <div className="vista-3d">
      <div className="vista-3d-figura">
        <GrullaPlegable modo="interactivo" />
        <span className="vista-3d-pista">
          Haz clic en la grulla para plegarla y desplegarla
        </span>
      </div>

      <div className="vista-3d-datos">
        <div className="origami-badges">
          <span className="badge-categoria">{hoja?.categoria}</span>
          <span className={`badge-prioridad prio-${prioridad.toLowerCase()}`}>
            {prioridad}
          </span>
        </div>
        <h3>{hoja?.titulo}</h3>
        <p className="origami-detalle">{hoja?.contenido}</p>
        <span className={`origami-estado ${plegada ? 'plegada' : ''}`}>
          {plegada ? 'Plegada' : 'Desplegada'}
        </span>
      </div>
    </div>
  );
}

export default Origami3D;
