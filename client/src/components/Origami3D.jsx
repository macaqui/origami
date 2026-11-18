import { useState } from 'react';

// Tarjeta de origami en 3D (igual idea que la tarjeta de la cívica):
//   - la cara frontal muestra una grulla de papel plegada (SVG "literal");
//   - al hacer clic, la tarjeta gira en 3D (rotateY) y muestra los detalles.
// Todo es CSS + SVG: sin librerías 3D, funciona en cualquier PC.
function Origami3D({ hoja }) {
  const [volteada, setVolteada] = useState(false);

  const plegada = Boolean(hoja?.plegada);
  const prioridad = hoja?.prioridad || 'Media';

  const girar = () => setVolteada((valor) => !valor);

  const alPresionarTecla = (evento) => {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      girar();
    }
  };

  return (
    <div className="origami-escena">
      <div
        className={`origami-tarjeta ${volteada ? 'volteada' : ''} ${
          plegada ? 'esta-plegada' : ''
        }`}
        onClick={girar}
        onKeyDown={alPresionarTecla}
        role="button"
        tabIndex={0}
        title="Clic para girar la figura"
      >
        {/* ---------- Cara frontal: la grulla de papel ---------- */}
        <div className="origami-cara origami-frontal">
          <svg
            className="origami-svg"
            viewBox="0 0 240 220"
            role="img"
            aria-label="Grulla de origami plegada en papel"
          >
            {/* Ala izquierda */}
            <polygon points="120,96 14,36 86,130" fill="#eef3f9" />
            <polygon points="120,96 14,36 62,74" fill="#dbe4ef" />
            {/* Ala derecha */}
            <polygon points="120,96 226,36 154,130" fill="#b9c9dd" />
            <polygon points="120,96 226,36 178,74" fill="#cdd9e7" />
            {/* Cola */}
            <polygon points="156,132 182,50 166,92" fill="#cfdae8" />
            {/* Cuello */}
            <polygon points="84,132 58,50 74,92" fill="#f7fafd" />
            {/* Cabeza */}
            <polygon points="58,50 36,36 64,40" fill="#9fb0c4" />
            {/* Cuerpo */}
            <polygon points="120,84 156,132 120,184 84,132" fill="#ffffff" />
            {/* Pliegue central del cuerpo */}
            <polygon points="120,84 120,184 84,132" fill="#edf1f6" />
            {/* Sombra bajo la figura */}
            <ellipse cx="120" cy="192" rx="50" ry="7" fill="rgba(15,23,42,0.28)" />
          </svg>
          <span className="origami-pista">Clic para girar</span>
        </div>

        {/* ---------- Cara trasera: los detalles de la hoja ---------- */}
        <div className="origami-cara origami-trasera">
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
          <span className="origami-pista">Clic para volver</span>
        </div>
      </div>
    </div>
  );
}

export default Origami3D;
