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
import Origami3D from './components/Origami3D';
import GrullaPlegable from './components/GrullaPlegable';
import './App.css';

function App() {
  const [hojas, setHojas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [hojaEditando, setHojaEditando] = useState(null);
  const [hojaDetalle, setHojaDetalle] = useState(null);

  // Carga las hojas desde la API al montar el componente.
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

  // Trae una hoja por su id y la muestra en el modal "Ver 3D".
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
      <header className="hero">
        <div className="hero-texto">
          <p className="hero-etiqueta">Gestor de notas y tareas plegables</p>
          <h1>Origami</h1>
          <p className="hero-descripcion">
            Cada nota es una <strong>hoja de papel</strong>: escríbela, pliégala
            cuando la termines y despliégala cuando quieras volver a ella.
          </p>
          <div className="resumen-contadores">
            <span>
              Total: <strong>{hojas.length}</strong>
            </span>
            <span>
              Activas: <strong>{totalPendientes}</strong>
            </span>
            <span>
              Plegadas: <strong>{totalPlegadas}</strong>
            </span>
          </div>
        </div>

        <div className="hero-figura" aria-hidden="true">
          <GrullaPlegable modo="respiro" />
        </div>
      </header>

      {error && <div className="banner-error">{error}</div>}

      <main className="layout-principal">
        <aside className="columna-form">
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
            <p className="modal-titulo">Vista 3D - Origami</p>
            <Origami3D hoja={hojaDetalle} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
