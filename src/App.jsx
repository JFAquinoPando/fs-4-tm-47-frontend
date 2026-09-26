import { useEffect, useState, useMemo } from 'react'
import { Tarjeta } from './componentes/Tarjeta'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
const FETCH_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'Accept': 'application/json'
}

function App() {
  const [listado, setListado] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos') // 'todos' | 'vivos' | 'caidos' | 'titanes'

  const ejecutarPeticion = () => {
    setCargando(true)
    setError(null)
    fetch(`${API_URL}/api/personajes`, { headers: FETCH_HEADERS })
      .then((peticion) => {
        if (!peticion.ok) {
          throw new Error(`Error en la solicitud: ${peticion.status}`)
        }
        return peticion.json()
      })
      .then((personajes) => {
        setListado(personajes)
        setCargando(false)
      })
      .catch((err) => {
        console.error("Error al cargar los personajes:", err)
        setError(`No se pudo conectar con el Cuartel General (${API_URL}). Asegúrate de que el servidor esté activo.`)
        setCargando(false)
      })
  }

  useEffect(() => {
    let ignorar = false

    fetch(`${API_URL}/api/personajes`, { headers: FETCH_HEADERS })
      .then((peticion) => {
        if (!peticion.ok) {
          throw new Error(`Error en la solicitud: ${peticion.status}`)
        }
        return peticion.json()
      })
      .then((personajes) => {
        if (!ignorar) {
          setListado(personajes)
          setCargando(false)
        }
      })
      .catch((err) => {
        if (!ignorar) {
          console.error("Error al cargar los personajes:", err)
          setError(`No se pudo conectar con el Cuartel General (${API_URL}). Asegúrate de que el servidor esté activo.`)
          setCargando(false)
        }
      })

    return () => {
      ignorar = true
    }
  }, [])

  // Filtrado reactivo de personajes
  const personajesFiltrados = useMemo(() => {
    return listado.filter((p) => {
      // Filtro por texto
      const coincideBusqueda =
        p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.alias?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.residencia?.toLowerCase().includes(busqueda.toLowerCase())

      if (!coincideBusqueda) return false

      // Filtro por categoría militar
      const isAlive = typeof p.vivo === 'boolean' ? p.vivo : p.estado?.toLowerCase()?.includes('vivo')
      const esTitan =
        (Array.isArray(p.especies) && p.especies.some(e => e.toLowerCase().includes('titan'))) ||
        p.alias?.toLowerCase()?.includes('titan') ||
        p.estatura >= 15

      if (filtro === 'vivos') return isAlive
      if (filtro === 'caidos') return !isAlive
      if (filtro === 'titanes') return esTitan

      return true
    })
  }, [listado, busqueda, filtro])

  // Métricas para la cabecera
  const estadisticas = useMemo(() => {
    const total = listado.length
    const vivos = listado.filter(p => typeof p.vivo === 'boolean' ? p.vivo : p.estado?.toLowerCase()?.includes('vivo')).length
    const titanes = listado.filter(p => 
      (Array.isArray(p.especies) && p.especies.some(e => e.toLowerCase().includes('titan'))) ||
      p.alias?.toLowerCase()?.includes('titan') ||
      p.estatura >= 15
    ).length
    const caidos = total - vivos
    return { total, vivos, caidos, titanes }
  }, [listado])

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Barra de estado superior */}
      <div className="bg-stone-950/90 border-b border-stone-800 text-stone-400 text-xs py-1.5 px-4 font-mono tracking-widest flex justify-between items-center">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          ESTADO: DISTRITO TROST — SECTOR SUR
        </span>
        <span className="hidden sm:inline text-amber-500/80 font-cinzel">
          MURALLA SINA • MURALLA ROSE • MURALLA MARÍA
        </span>
      </div>

      {/* Hero / Banner Principal */}
      <header className="relative border-b border-stone-800/80 bg-gradient-to-b from-stone-950 via-stone-900/60 to-stone-950 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Marca de agua de fondo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center font-decorative text-9xl text-stone-100 select-none">
          進撃の巨人
        </div>

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Emblema Alas de la Libertad (Wings of Freedom) */}
          <div className="mb-4 relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-stone-900/80 border-2 border-amber-600/80 p-3 shadow-xl shadow-emerald-950/50 flex items-center justify-center backdrop-blur-sm group-hover:border-amber-400 transition-colors">
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow">
                {/* Alas estilizadas del Cuerpo de Exploración */}
                <path d="M50 8 L85 24 L85 58 C85 78 50 94 50 94 C50 94 15 78 15 58 L15 24 Z" fill="#0f231b" stroke="#c5a059" strokeWidth="3" />
                <path d="M48 25 C40 32 32 45 35 60 C38 48 44 40 48 35 Z" fill="#ffffff" />
                <path d="M52 30 C60 37 68 50 65 65 C62 53 56 45 52 40 Z" fill="#1e3a8a" />
                <path d="M48 38 C42 43 36 53 38 65 C41 56 45 49 48 45 Z" fill="#ffffff" />
                <path d="M52 43 C58 48 64 58 62 70 C59 61 55 54 52 50 Z" fill="#1e3a8a" />
              </svg>
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-stone-950 text-amber-500 text-[10px] font-cinzel font-bold px-2 py-0.5 rounded border border-amber-600/50 uppercase tracking-widest whitespace-nowrap">
              Regimiento Scout
            </span>
          </div>

          <p className="text-amber-500/90 font-cinzel text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-1">
            Cuerpo de Exploración • Archivo Militar
          </p>

          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-wider text-stone-100 drop-shadow-md">
            SHINGEKI NO KYOJIN
          </h1>

          <p className="mt-3 text-stone-400 font-sans max-w-2xl text-sm sm:text-base italic">
            "Ofreced vuestros corazones a la causa de la humanidad tras las murallas."
          </p>

          {/* Estadísticas rápidas */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-3xl">
            <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-3 text-center backdrop-blur-sm">
              <span className="text-stone-400 text-xs uppercase font-medium tracking-wider block">Registros</span>
              <span className="text-2xl font-bold font-mono text-amber-200">{estadisticas.total}</span>
            </div>
            <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-3 text-center backdrop-blur-sm">
              <span className="text-emerald-400/90 text-xs uppercase font-medium tracking-wider block">Con Vida</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">{estadisticas.vivos}</span>
            </div>
            <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-3 text-center backdrop-blur-sm">
              <span className="text-rose-400/90 text-xs uppercase font-medium tracking-wider block">Caídos</span>
              <span className="text-2xl font-bold font-mono text-rose-400">{estadisticas.caidos}</span>
            </div>
            <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-3 text-center backdrop-blur-sm">
              <span className="text-amber-400/90 text-xs uppercase font-medium tracking-wider block">Titanes</span>
              <span className="text-2xl font-bold font-mono text-amber-400">{estadisticas.titanes}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de Filtros y Búsqueda */}
        <section className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-stone-900/70 p-4 rounded-xl border border-stone-800 backdrop-blur-sm shadow-md">
            {/* Buscador */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Buscar por soldado, alias, distrito..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-stone-950/80 border border-stone-700/80 rounded-lg pl-10 pr-4 py-2.5 text-stone-200 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              <svg
                className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Botones de filtro por categoría */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'vivos', label: 'Vivos' },
                { id: 'caidos', label: 'Caídos' },
                { id: 'titanes', label: 'Titanes' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFiltro(btn.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-semibold tracking-wider transition-all ${
                    filtro === btn.id
                      ? 'bg-amber-600 text-stone-950 shadow-md font-bold'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-amber-300 border border-stone-700/50'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Estado: Cargando */}
        {cargando && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="font-cinzel text-amber-300 tracking-widest text-sm uppercase animate-pulse">
              Consultando archivos del Cuerpo de Exploración...
            </p>
          </div>
        )}

        {/* Estado: Error */}
        {error && (
          <div className="my-8 p-6 rounded-xl bg-rose-950/50 border border-rose-800/80 text-center space-y-3">
            <div className="inline-flex p-3 bg-rose-900/40 rounded-full text-rose-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-cinzel text-lg font-bold text-rose-200">Fallo en la Transmisión Militar</h3>
            <p className="text-sm text-rose-300/90 max-w-lg mx-auto">{error}</p>
            <button
              onClick={ejecutarPeticion}
              className="mt-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-cinzel tracking-wider rounded-lg border border-stone-700 transition-colors"
            >
              Reintentar Conexión
            </button>
          </div>
        )}

        {/* Estado: Sin resultados */}
        {!cargando && !error && personajesFiltrados.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <p className="font-cinzel text-xl text-stone-400">
              No se han encontrado registros en los archivos para "{busqueda}"
            </p>
            <p className="text-xs text-stone-500 font-mono">
              Verifica el nombre o ajusta los filtros de batallón.
            </p>
          </div>
        )}

        {/* Cuadrícula de Tarjetas */}
        {!cargando && !error && personajesFiltrados.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {personajesFiltrados.map((p) => (
              <Tarjeta
                key={p.id}
                nombre={p.nombre}
                imagen={p.imagen}
                alias={p.alias}
                estado={p.estado}
                vivo={p.vivo}
                estatura={p.estatura}
                edad={p.edad}
                especies={p.especies}
                residencia={p.residencia}
                lugarNacimiento={p.lugarNacimiento}
              />
            ))}
          </section>
        )}
      </main>

      {/* Pie de página militar */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>
            REGISTRO DE INTELIGENCIA DE PARADIS © {new Date().getFullYear()} — CUERPO DE EXPLORACIÓN
          </p>
          <p className="text-amber-600/80 font-cinzel">
            SHINZOU WO SASAGEYO (心臓を捧げよ)
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
