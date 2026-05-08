import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productosApi } from '../api'
import { useAuth } from '../context/AuthContext'

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role } = useAuth()
  const esAdmin = role === 'ADMIN'

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ['producto', id],
    queryFn: () => productosApi.getById(Number(id)),
    enabled: !!id,
  })

  if (isLoading) return <p className="text-slate-400">Cargando producto...</p>
  if (isError || !producto) return (
    <div className="text-center py-20">
      <p className="text-red-400 text-lg mb-4">Producto no encontrado</p>
      <button onClick={() => navigate('/productos')} className="btn-secondary">← Volver</button>
    </div>
  )

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate('/productos')} className="text-slate-400 hover:text-slate-100 text-sm mb-6 flex items-center gap-1 transition-colors">
        ← Volver a productos
      </button>

      <div className="card mb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-display text-3xl text-slate-100">{producto.nombre}</h1>
            {producto.descripcion && <p className="text-slate-400 mt-2">{producto.descripcion}</p>}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-brand-400">${producto.precio.toFixed(2)}</div>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium ${producto.activo ? 'bg-green-900/40 text-green-300' : 'bg-slate-800 text-slate-500'}`}>
              {producto.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        {/* Botones CRUD solo para ADMIN */}
        {esAdmin && (
          <div className="flex gap-2 mb-4">
            <button onClick={() => navigate('/productos')} className="btn-secondary py-1 px-3">
              Editar
            </button>
          </div>
        )}

        <div className="border-t border-border pt-4 mt-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Categorías ({producto.categorias.length})
          </h2>
          {producto.categorias.length === 0
            ? <p className="text-slate-500 text-sm">Sin categorías asignadas</p>
            : (
              <div className="flex flex-wrap gap-2">
                {producto.categorias.map(c => (
                  <div key={c.id} className="px-3 py-1.5 bg-brand-900/50 border border-brand-700/50 rounded-lg">
                    <div className="text-brand-300 text-sm font-medium">{c.nombre}</div>
                    {c.descripcion && <div className="text-brand-400/70 text-xs">{c.descripcion}</div>}
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Ingredientes ({producto.ingredientes.length})
          </h2>
          {producto.ingredientes.length === 0
            ? <p className="text-slate-500 text-sm">Sin ingredientes asignados</p>
            : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-border">
                    <th className="pb-2">Ingrediente</th>
                    <th className="pb-2">Cantidad</th>
                    <th className="pb-2">Unidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {producto.ingredientes.map(ing => (
                    <tr key={ing.ingrediente_id}>
                      <td className="py-2 text-slate-200">{ing.nombre}</td>
                      <td className="py-2 text-slate-300 font-mono">{ing.cantidad}</td>
                      <td className="py-2 text-slate-400">{ing.unidad_medida}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>

      <div className="card bg-surface/50 text-sm text-slate-400">
        <strong className="text-slate-300">Resumen:</strong> El producto <em className="text-slate-200">{producto.nombre}</em>
        {producto.categorias.length > 0
          ? <> pertenece a {producto.categorias.length === 1 ? 'la categoría' : 'las categorías'} <strong className="text-brand-300">{producto.categorias.map(c => c.nombre).join(', ')}</strong></>
          : <> no tiene categorías asignadas</>}
        {producto.ingredientes.length > 0
          ? <> y contiene los ingredientes: <strong className="text-slate-200">{producto.ingredientes.map(i => i.nombre).join(', ')}</strong>.</>
          : <> y no tiene ingredientes.</>}
      </div>
    </div>
  )
}
