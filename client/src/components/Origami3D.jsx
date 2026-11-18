// ---------------------------------------------------------------------------
// Grulla de origami en 3D (CSS puro, sin librerías).
//
// El dibujo de la grulla está repartido en TRES capas de profundidad: el ala
// lejana (z negativa), el cuerpo (z = 0) y el ala cercana (z positiva). Cada
// capa es un SVG colocado a distinta distancia dentro de un contenedor con
// `perspective`; así, cuando el conjunto gira sobre su eje Y, las capas se
// separan y la figura se ve de verdad en tres dimensiones, como una grulla de
// papel real. Es la misma idea que la tarjeta de la cívica, pero con volumen.
// ---------------------------------------------------------------------------

// Ala lejana: el ala derecha del dibujo, que queda por detrás del cuerpo.
function AlaLejana() {
  return (
    <>
      <polygon points="120,96 226,36 154,130" fill="#b9c9dd" />
      <polygon points="120,96 226,36 178,74" fill="#cdd9e7" />
      <polygon points="156,132 182,50 166,92" fill="#cfdae8" />
    </>
  );
}

// Cuerpo: el tronco, el pliegue central, el cuello y la cabeza.
function Cuerpo() {
  return (
    <>
      <polygon points="120,84 156,132 120,184 84,132" fill="#ffffff" />
      <polygon points="120,84 120,184 84,132" fill="#edf1f6" />
      <polygon points="84,132 58,50 74,92" fill="#f7fafd" />
      <polygon points="58,50 36,36 64,40" fill="#9fb0c4" />
    </>
  );
}

// Ala cercana: el ala izquierda del dibujo, que queda por delante del cuerpo.
function AlaCercana() {
  return (
    <>
      <polygon points="120,96 14,36 86,130" fill="#eef3f9" />
      <polygon points="120,96 14,36 62,74" fill="#dbe4ef" />
    </>
  );
}

const CAPAS = [
  { clase: 'grulla-capa-atras', contenido: <AlaLejana /> },
  { clase: 'grulla-capa-cuerpo', contenido: <Cuerpo /> },
  { clase: 'grulla-capa-frente', contenido: <AlaCercana /> }
];

// La figura sola (sin datos). Se usa también como fondo decorativo de la página.
export function Grulla3D({ className = '' }) {
  return (
    <div className={`grulla-escena ${className}`.trim()} role="img" aria-label="Grulla de origami en tres dimensiones">
      <div className="grulla-giro">
        {CAPAS.map((capa) => (
          <svg
            key={capa.clase}
            className={`grulla-capa ${capa.clase}`}
            viewBox="0 0 240 220"
            aria-hidden="true"
          >
            {capa.contenido}
          </svg>
        ))}
      </div>
      <span className="grulla-sombra" aria-hidden="true" />
    </div>
  );
}

// La grulla acompañada de los datos de la hoja (la que se abre con "Ver 3D").
function Origami3D({ hoja }) {
  const plegada = Boolean(hoja?.plegada);
  const prioridad = hoja?.prioridad || 'Media';

  return (
    <div className="vista-3d">
      <Grulla3D />

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
