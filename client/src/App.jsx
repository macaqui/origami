import { useState, useEffect } from 'react';
import {
  listarHojas,
  obtenerHoja,
  crearHoja,
  actualizarHoja,
  eliminarHoja
} from './services/hojasService';
import HojaForm from './components/HojaForm';
import HojaCard from './components/HojaCard';
import Origami3D, { Grulla3D } from './components/Origami3D';
import './App.css';

function App() {
  const [hojas, setHojas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [hojaEditando, setHojaEditando] = useState(null);
  const [hojaDetalle, setHojaDetalle] = useState(null);

  // Carga inicial desde la API. El estado se actualiza solo dentro de los
  // callbacks de la promesa, y se ignora el resultado si el componente ya se
  // desmontó (patrón estándar de limpieza en React).
  useEffect(() => {
    let activo = true;

    listarHojas()
      .then((data) => {
        if (!activo) return;
        setHojas(data);
        setError('');
      })
      .catch((err) => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  // Paralaje 3D: al mover el ratón, toda la escena se inclina un poco y la
  // grulla del fondo se desplaza en sentido contrario (efecto de profundidad).
  // Solo se escriben dos variables CSS, así que React no vuelve a renderizar.
  useEffect(() => {
    const alMover = (evento) => {
      const x = evento.clientX / window.innerWidth - 0.5;
      const y = evento.clientY / window.innerHeight - 0.5;
      document.documentElement.style.setProperty('--px', x.toFixed(3));
      document.documentElement.style.setProperty('--py', y.toFixed(3));
    };

    window.addEventListener('mousemove', alMover);
    return () => window.removeEventListener('mousemove', alMover);
  }, []);

  const handleGuardar = async (datosHoja) => {
    try {
      if (hojaEditando) {
        const actualizada = await actualizarHoja(hojaEditando.id, datosHoja);
        setHojas((prev) =>
          prev.map((h) => (h.id === actualizada.id ? actualizada : h))
        );
        setHojaEditando(null);
      } else {
        const creada = await crearHoja(datosHoja);
        setHojas((prev) => [creada, ...prev]);
      }
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTogglePlegar = async (hoja) => {
    try {
      const actualizada = await actualizarHoja(hoja.id, {
        ...hoja,
        plegada: !hoja.plegada
      });
      setHojas((prev) =>
        prev.map((h) => (h.id === actualizada.id ? actualizada : h))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta hoja?')) return;
    try {
      await eliminarHoja(id);
      setHojas((prev) => prev.filter((h) => h.id !== id));
      if (hojaEditando && hojaEditando.id === id) {
        setHojaEditando(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // 5.ª petición a la API: trae una sola hoja (GET /api/hojas/:id) y la
  // muestra junto a la grulla de origami en 3D.
  const handleVer = async (hoja) => {
    try {
      const detalle = await obtenerHoja(hoja.id);
      setHojaDetalle(detalle);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const hojasFiltradas = hojas.filter((hoja) => {
    const coincideCategoria =
      filtroCategoria === 'Todas' || hoja.categoria === filtroCategoria;
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      hoja.titulo.toLowerCase().includes(texto) ||
      hoja.contenido.toLowerCase().includes(texto);
    return coincideCategoria && coincideTexto;
  });

  const totalPlegadas = hojas.filter((h) => Boolean(h.plegada)).length;
  const totalPendientes = hojas.length - totalPlegadas;

  return (
    <div className="contenedor-app">
      {/* Grulla gigante girando detrás de todo: da la sensación de que la
          página entera vive dentro de un mundo de papel. */}
      <div className="fondo-origami" aria-hidden="true">
        <Grulla3D />
      </div>

      {/* Todo el contenido se inclina en 3D siguiendo al ratón. */}
      <div className="mundo-3d">
        <header className="topbar">
          <div>
            <h1>Origami</h1>
            <p>Gestor modular de notas y tareas plegables</p>
          </div>
          <div className="resumen-contadores">
            <span>Total: <strong>{hojas.length}</strong></span>
            <span>Activas: <strong>{totalPendientes}</strong></span>
            <span>Plegadas: <strong>{totalPlegadas}</strong></span>
          </div>
        </header>

        {error && <div className="banner-error">{error}</div>}

        <main className="layout-principal">
          <aside>
            <HojaForm
              key={hojaEditando ? hojaEditando.id : 'nueva'}
              onGuardar={handleGuardar}
              hojaEditando={hojaEditando}
              onCancelarEdicion={() => setHojaEditando(null)}
            />
          </aside>

          <section className="panel-hojas">
            <div className="barra-filtros">
              <input
                type="text"
                placeholder="Buscar por título o contenido..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                <option value="Todas">Todas las categorías</option>
                <option value="Desarrollo">Desarrollo</option>
                <option value="Base de Datos">Base de Datos</option>
                <option value="Estudio">Estudio</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            {cargando ? (
              <p className="estado-vacio">Cargando hojas...</p>
            ) : hojasFiltradas.length === 0 ? (
              <p className="estado-vacio">No hay hojas que coincidan con el filtro.</p>
            ) : (
              <div className="grid-hojas">
                {hojasFiltradas.map((hoja) => (
                  <HojaCard
                    key={hoja.id}
                    hoja={hoja}
                    onTogglePlegar={handleTogglePlegar}
                    onEditar={setHojaEditando}
                    onEliminar={handleEliminar}
                    onVer={handleVer}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {hojaDetalle && (
        <div className="modal-fondo" onClick={() => setHojaDetalle(null)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-cerrar"
              onClick={() => setHojaDetalle(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <p className="modal-titulo">Vista 3D — Origami</p>
            <Origami3D hoja={hojaDetalle} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
