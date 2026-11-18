import { useEffect, useRef } from 'react';

// Grulla de origami que se pliega y se despliega con CSS 3D (sin librerías).
// Cada parte de la figura es un div que gira sobre su borde como una bisagra, y
// las caras de papel son triángulos recortados con clip-path.
// modo="respiro" se usa en la portada; modo="interactivo" en el modal.

const U = 120; // unidad base, en píxeles
const PAPEL_1 = '#efe2c9';
const PAPEL_2 = '#e3cfa6';
const PAPEL_3 = '#d8bf90';
const PICO = '#c1432a';

// Recortes (clip-path) sobre una caja de U x U.
const RECORTES = {
  R: 'polygon(0 0, 100% 50%, 0 100%)',
  L: 'polygon(100% 0, 0 50%, 100% 100%)',
  UP: 'polygon(0 100%, 50% 0, 100% 100%)',
  DN: 'polygon(0 0, 100% 0, 50% 100%)',
  NE: 'polygon(0 0, 100% 0, 0 100%)',
  NW: 'polygon(0 0, 100% 0, 100% 100%)'
};

const px = (n) => `${n}px`;
const deg = (n) => `${n}deg`;

// Arma la grulla dentro de `pivote` y devuelve la función aplicar(fold),
// donde fold va de 0 (hoja plana) a 1 (grulla plegada).
function armarGrulla(pivote) {
  const bisagras = [];
  const caras = [];
  const duenio = new Map();

  const bisagra = (padre, spec) => {
    const el = document.createElement('div');
    el.className = 'grulla-bisagra';
    padre.appendChild(el);
    const b = { el, ax: 'X', a0: 0, a1: 0, tx: 0, ty: 0, tz: 0, angulo: 0, ...spec };
    bisagras.push(b);
    duenio.set(el, b);
    return el;
  };

  const cara = (padre, recorte, papel, ancho, alto, transform) => {
    const el = document.createElement('div');
    el.className = 'grulla-cara';
    el.style.setProperty('--clip', RECORTES[recorte]);
    el.style.background = papel;
    el.style.width = px(ancho);
    el.style.height = px(alto);
    el.style.transform = transform;
    padre.appendChild(el);
    caras.push({ el, bisagra: duenio.get(padre) });
    return el;
  };

  const raiz = bisagra(pivote, {});

  // Cuerpo: rombo central con la quilla vertical.
  cara(raiz, 'UP', PAPEL_1, U, U, `translate(${px(-U / 2)}, ${px(-U * 0.55)})`);
  cara(raiz, 'DN', PAPEL_2, U, U, `translate(${px(-U / 2)}, ${px(-U * 0.05)})`);

  // Alas (sx = +1 derecha, -1 izquierda), cada una con su punta.
  const ala = (sx) => {
    const b = bisagra(raiz, { ax: 'Y', a0: 0, a1: sx > 0 ? -58 : 58, ty: -U * 0.18 });
    cara(
      b,
      sx > 0 ? 'R' : 'L',
      PAPEL_2,
      U * 1.15,
      U * 0.92,
      sx > 0
        ? `translate(0, ${px(-U * 0.46)})`
        : `translate(${px(-U * 1.15)}, ${px(-U * 0.46)})`
    );
    const t = bisagra(b, { ax: 'X', a0: 0, a1: -48, tx: sx * U * 0.78, ty: -U * 0.04 });
    cara(
      t,
      sx > 0 ? 'R' : 'L',
      PAPEL_3,
      U * 0.5,
      U * 0.5,
      sx > 0
        ? `translate(0, ${px(-U * 0.25)})`
        : `translate(${px(-U * 0.5)}, ${px(-U * 0.25)})`
    );
  };
  ala(1);
  ala(-1);

  // Cuello, cabeza y pico.
  const cuello = bisagra(raiz, { ax: 'X', a0: 0, a1: -72, ty: -U * 0.5, tz: U * 0.02 });
  cara(cuello, 'UP', PAPEL_1, U * 0.34, U * 0.9, `translate(${px(-U * 0.17)}, ${px(-U * 0.9)})`);

  const cabeza = bisagra(cuello, { ax: 'X', a0: 0, a1: 64, ty: -U * 0.9 });
  cara(cabeza, 'L', PAPEL_2, U * 0.4, U * 0.34, `translate(${px(-U * 0.34)}, ${px(-U * 0.17)})`);

  const pico = bisagra(cabeza, { ax: 'X', a0: 0, a1: -40, tx: -U * 0.3 });
  cara(pico, 'L', PICO, U * 0.2, U * 0.16, `translate(${px(-U * 0.2)}, ${px(-U * 0.08)})`);

  // Cola: dos tramos.
  const cola = bisagra(raiz, { ax: 'X', a0: 0, a1: 54, ty: U * 0.42, tz: -U * 0.02 });
  cara(cola, 'DN', PAPEL_3, U * 0.42, U * 0.95, `translate(${px(-U * 0.21)}, 0)`);

  const cola2 = bisagra(cola, { ax: 'X', a0: 0, a1: -30, ty: U * 0.7 });
  cara(cola2, 'DN', PAPEL_2, U * 0.28, U * 0.5, `translate(${px(-U * 0.14)}, 0)`);

  const aplicar = (fold) => {
    for (const b of bisagras) {
      const a = b.a0 + (b.a1 - b.a0) * fold;
      b.angulo = a;
      b.el.style.transform = `translate3d(${px(b.tx)}, ${px(b.ty)}, ${px(b.tz)}) rotate${b.ax}(${deg(a)})`;
    }
    // Sombreado: cada cara se oscurece según cuánto se ha doblado su bisagra.
    for (const c of caras) {
      const a = c.bisagra ? Math.abs(c.bisagra.angulo) : 0;
      const sombra = 0.05 + 0.4 * (1 - Math.cos((a * Math.PI) / 180)) * 0.5;
      c.el.style.setProperty('--sh', String(Math.min(0.46, sombra)));
    }
  };

  return aplicar;
}

function GrullaPlegable({ modo = 'respiro' }) {
  const escenario = useRef(null);

  useEffect(() => {
    const stage = escenario.current;
    if (!stage) return undefined;

    const pivote = document.createElement('div');
    pivote.className = 'grulla-escena-pivote';
    stage.appendChild(pivote);

    const aplicar = armarGrulla(pivote);

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const esRespiro = modo === 'respiro';
    const yawBase = esRespiro ? 26 : 22;

    let raf = 0;
    let vivo = true;
    let phase = 0;
    let fold = 1;
    let objetivo = 1;
    let spin = yawBase;
    let baseYaw = yawBase;
    let ultimo = 0;

    const ajustar = () => {
      const ancho = stage.clientWidth || 360;
      const alto = stage.clientHeight || 340;
      const k = Math.min(ancho, alto) / 400;
      pivote.style.scale = String(Math.max(0.42, Math.min(1.4, k)));
    };

    const pintar = (t) => {
      const yaw = spin + Math.sin(t * 0.45) * (esRespiro ? 7 : 4);
      const tilt = -18 + Math.sin(t * 0.7) * 3;
      const lift = -U * 0.05 - U * 0.32 * fold;
      pivote.style.transform = `translateY(${px(lift)}) rotateX(${deg(tilt)}) rotateY(${deg(yaw)})`;
    };

    const bucle = (ahora) => {
      if (!vivo) return;
      const t = ahora / 1000;
      const dt = ultimo ? Math.min(0.05, (ahora - ultimo) / 1000) : 0.016;
      ultimo = ahora;

      if (esRespiro) {
        // "Respiración": se detiene un momento plano y otro plegado.
        phase += 0.0075 * dt * 60;
        const s = Math.cos(phase) * 0.5 + 0.5;
        fold = s * s * (3 - 2 * s);
      } else {
        fold += (objetivo - fold) * Math.min(1, dt * 3.4);
        if (Math.abs(objetivo - fold) < 0.001) fold = objetivo;
      }

      spin += (baseYaw - spin) * Math.min(1, dt * 2.5);
      aplicar(fold);
      pintar(t);
      raf = requestAnimationFrame(bucle);
    };

    const alMover = (evento) => {
      const amplitud = esRespiro ? 34 : 20;
      baseYaw = yawBase + (evento.clientX / window.innerWidth - 0.5) * amplitud;
    };

    const alClic = () => {
      if (!esRespiro) objetivo = objetivo > 0.5 ? 0 : 1;
    };

    const alTecla = (evento) => {
      if (!esRespiro && (evento.key === 'Enter' || evento.key === ' ')) {
        evento.preventDefault();
        objetivo = objetivo > 0.5 ? 0 : 1;
      }
    };

    const alVisibilidad = () => {
      if (document.hidden) {
        vivo = false;
        cancelAnimationFrame(raf);
      } else if (!vivo) {
        vivo = true;
        ultimo = 0;
        raf = requestAnimationFrame(bucle);
      }
    };

    ajustar();
    aplicar(1);
    pintar(performance.now() / 1000);

    const observador = new ResizeObserver(ajustar);
    observador.observe(stage);

    if (sinMovimiento) {
      aplicar(1);
      pintar(0);
    } else {
      window.addEventListener('mousemove', alMover);
      document.addEventListener('visibilitychange', alVisibilidad);
      raf = requestAnimationFrame(bucle);
    }

    stage.addEventListener('click', alClic);
    stage.addEventListener('keydown', alTecla);

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      observador.disconnect();
      window.removeEventListener('mousemove', alMover);
      document.removeEventListener('visibilitychange', alVisibilidad);
      stage.removeEventListener('click', alClic);
      stage.removeEventListener('keydown', alTecla);
      if (pivote.parentNode === stage) stage.removeChild(pivote);
    };
  }, [modo]);

  const interactivo = modo === 'interactivo';

  return (
    <div
      className="grulla-escena"
      ref={escenario}
      {...(interactivo
        ? {
            role: 'button',
            tabIndex: 0,
            'aria-label': 'Grulla de origami: pulsa para plegarla o desplegarla'
          }
        : { 'aria-hidden': 'true' })}
    />
  );
}

export default GrullaPlegable;
