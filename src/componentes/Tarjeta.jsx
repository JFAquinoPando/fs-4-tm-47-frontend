import { useState } from 'react'

export function Tarjeta({
  nombre,
  alias,
  imagen,
  estado,
  edad,
  estatura,
  vivo,
  especies = [],
  residencia,
  lugarNacimiento
}) {
  const [imgError, setImgError] = useState(false)

  // Determinar si está con vida
  const isAlive = typeof vivo === 'boolean'
    ? vivo
    : (typeof estado === 'string' ? estado.toLowerCase().includes('vivo') : true)

  const estadoTexto = estado || (isAlive ? 'Activo' : 'Caído')

  // Determinar si es Titán
  const esTitan = Boolean(
    (Array.isArray(especies) && especies.some(e => e.toLowerCase().includes('titan'))) ||
    (alias && alias.toLowerCase().includes('titan')) ||
    estatura >= 15
  )

  const tieneImagen = !imgError && imagen && imagen.trim() !== '' && imagen !== 'render.jpg'

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-600/60 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-emerald-950/40 transition-all duration-300 transform hover:-translate-y-1">
      {/* Marco decorativo militar superior */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-800 via-amber-600 to-emerald-900 z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Cabecera / Imagen del soldado */}
      <div className="relative">
        {/* Badges superiores flotantes */}
        <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
          {/* Badge de estado militar */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase shadow-md backdrop-blur-md ${
              isAlive
                ? 'bg-emerald-950/85 text-emerald-300 border border-emerald-600/50'
                : 'bg-rose-950/85 text-rose-300 border border-rose-600/50'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isAlive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            {estadoTexto}
          </span>

          {/* Badge de especie / Titán */}
          {esTitan && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-cinzel tracking-wider uppercase bg-amber-950/85 text-amber-300 border border-amber-500/50 shadow-md backdrop-blur-md">
              <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
              Titán
            </span>
          )}
        </div>

        {/* Retrato / Picture */}
        <picture className="block relative w-full h-72 sm:h-80 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 overflow-hidden">
          {tieneImagen ? (
            <img
              src={imagen}
              alt={nombre}
              onError={() => setImgError(true)}
              loading="lazy"
              className="w-full h-full object-cover object-top filter contrast-105 brightness-95 group-hover:scale-105 group-hover:brightness-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-stone-600 bg-stone-950/80">
              <svg
                className="w-20 h-20 mb-2 opacity-30 text-amber-500/60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a3 3 0 116 0 3 3 0 01-6 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18.5a6 6 0 0112 0" />
              </svg>
              <span className="text-xs uppercase tracking-widest text-stone-500 font-cinzel">
                Sin Retrato Oficial
              </span>
            </div>
          )}

          {/* Sombra degradada para fundir con la tarjeta */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent pointer-events-none" />
        </picture>
      </div>

      {/* Contenido / Expediente del soldado */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Nombre y Alias */}
          <header className="border-b border-stone-800 pb-3">
            <h3 className="font-cinzel text-xl font-bold tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors leading-tight">
              {nombre}
            </h3>
            {alias ? (
              <p className="text-sm font-medium text-amber-500/80 italic mt-0.5 tracking-wide">
                "{alias}"
              </p>
            ) : (
              <p className="text-xs text-stone-500 uppercase tracking-widest mt-0.5 font-cinzel">
                Soldado de las Murallas
              </p>
            )}
          </header>

          {/* Lista de atributos técnicos / expediente */}
          <ul className="mt-4 space-y-2 text-xs">
            <li className="flex justify-between items-center py-1 border-b border-stone-800/60">
              <span className="text-stone-400 uppercase tracking-wider font-medium">Estado:</span>
              <span className={`font-semibold ${isAlive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {estadoTexto}
              </span>
            </li>
            <li className="flex justify-between items-center py-1 border-b border-stone-800/60">
              <span className="text-stone-400 uppercase tracking-wider font-medium">Edad:</span>
              <span className="text-stone-200 font-mono">
                {edad && Number(edad) > 0 ? `${edad} años` : 'Desconocida'}
              </span>
            </li>
            <li className="flex justify-between items-center py-1 border-b border-stone-800/60">
              <span className="text-stone-400 uppercase tracking-wider font-medium">Estatura:</span>
              <span className="text-stone-200 font-mono">
                {estatura && Number(estatura) > 0
                  ? estatura >= 15
                    ? `${estatura} m (Forma Titán)`
                    : `${estatura} m`
                  : 'Desconocida'}
              </span>
            </li>

            {lugarNacimiento && lugarNacimiento !== 'unknown' && (
              <li className="flex justify-between items-center py-1 border-b border-stone-800/60">
                <span className="text-stone-400 uppercase tracking-wider font-medium">Origen:</span>
                <span className="text-amber-200/80 font-medium truncate max-w-[140px] text-right" title={lugarNacimiento}>
                  {lugarNacimiento}
                </span>
              </li>
            )}

            {residencia && residencia !== 'unknown' && (
              <li className="flex justify-between items-center py-1 border-b border-stone-800/60">
                <span className="text-stone-400 uppercase tracking-wider font-medium">Residencia:</span>
                <span className="text-amber-200/80 font-medium truncate max-w-[140px] text-right" title={residencia}>
                  {residencia}
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Especies / Etiquetas de la Legión */}
        {Array.isArray(especies) && especies.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-1.5">
            {especies.map((esp, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-stone-800 text-stone-300 border border-stone-700/60"
              >
                {esp}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sello inferior del expediente */}
      <footer className="px-5 py-2.5 bg-stone-950/70 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-500 font-mono tracking-widest uppercase">
        <span>EXPEDIENTE MILITAR</span>
        <span className="text-amber-600/70 font-cinzel">PARADIS</span>
      </footer>
    </article>
  )
}