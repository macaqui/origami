import { useState, useEffect } from 'react';
import {
  listarHojas,
  crearHoja,
  actualizarHoja,
  eliminarHoja
} from './services/hojasService';
import HojaForm from './components/HojaForm';
import HojaCard from './components/HojaCard';
import './App.css';

function App() {
  const [hojas, setHojas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [hojaEditando, setHojaEditando] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await listarHojas();
      setHojas(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
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
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
