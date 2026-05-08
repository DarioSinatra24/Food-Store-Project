import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { productosApi, categoriasApi, ingredientesApi } from '../api'
import type { Producto, ProductoCreate, ProductoUpdate } from '../types'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

interface FormState {
  nombre: string
  descripcion: string
  precio: string
  activo: boolean
  categoria_ids: number[]
  ingredientes: { ingrediente_id: number; cantidad: number }[]
}

interface FormProps {
  initial?: Producto
  onSubmit: (data: ProductoCreate | ProductoUpdate) => void
  isLoading: boolean
  error: string | null
}

function ProductoForm({ initial, onSubmit, isLoading, error }: FormProps) {
  const [form, setForm] = useState<FormState>({
    nombre: initial?.nombre ?? '',
    descripcion: initial?.descripcion ?? '',
    precio: String(initial?.precio ?? ''),
    activo: initial?.activo ?? true,
    categoria_ids: initial?.categorias.map(c => c.id) ?? [],
    ingredientes: initial?.ingredientes.map(i => ({ ingrediente_id: i.ingrediente_id, cantidad: i.cantidad })) ?? [],
  })

  const { data: categorias = [] } = useQuery({ queryKey: ['categorias'], queryFn: () => categoriasApi.getAll() })
  const { data: ingredientes = [] } = useQuery({ queryKey: ['ingredientes'], queryFn: () => ingredientesApi.getAll() })

  const toggleCategoria = (id: number) => {
    setForm(f => ({
      ...f,
      categoria_ids: f.categoria_ids.includes(id)
        ? f.categoria_ids.filter(c => c !== id)
        : [...f.categoria_ids, id],
    }))
  }

  const toggleIngrediente = (id: number) => {
    setForm(f => {
      const exists = f.ingredientes.find(i => i.ingrediente_id === id)
      if (exists) return { ...f, ingredientes: f.ingredientes.filter(i => i.ingrediente_id !== id) }
      return { ...f, ingredientes: [...f.ingredientes, { ingrediente_id: id, cantidad: 1 }] }
    })
  }

  const setCantidad = (id: number, cantidad: number) => {
    setForm(f => ({ ...f, ingredientes: f.ingredientes.map(i => i.ingrediente_id === id ? { ...i, cantidad } : i) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || undefined,
      precio: Number(form.precio),
      activo: form.activo,
      categoria_ids: form.categoria_ids,
      ingredientes: form.ingredientes,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-400 mb-1">Nombre *</label>
          <input className="input-field" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required minLength={2} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-400 mb-1">Descripción</label>
          <textarea className="input-field resize-none" rows={2} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Precio *</label>
          <input className="input-field" type="number" min="0.01" step="0.01" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} required />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
            <span className="text-sm text-slate-300">Activo</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">Categorías</label>
        <div className="flex flex-wrap gap-2">
          {categorias.map(c => (
            <button key={c.id} type="button" onClick={() => toggleCategoria(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                form.categoria_ids.includes(c.id)
                  ? 'bg-brand-700 border-brand-500 text-white'
                  : 'bg-surface border-border text-slate-400 hover:border-brand-600'
              }`}>
              {c.nombre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">Ingredientes</label>
        <div className="space-y-2">
          {ingredientes.map(ing => {
            const sel = form.ingredientes.find(i => i.ingrediente_id === ing.id)
            return (
              <div key={ing.id} className="flex items-center gap-3">
                <input type="checkbox" checked={!!sel} onChange={() => toggleIngrediente(ing.id)} className="w-4 h-4 accent-brand-600" />
                <span className="text-sm text-slate-300 flex-1">{ing.nombre}</span>
                {sel && (
                  <div className="flex items-center gap-1">
                    <input type="number" min="0.01" step="0.01" value={sel.cantidad}
                      onChange={e => setCantidad(ing.id, Number(e.target.value))}
                      className="input-field w-20 py-1 text-xs" />
                    <span className="text-xs text-slate-500">{ing.unidad_medida}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Guardando...' : initial ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}

export default function ProductosPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { role } = useAuth()
  const esAdmin = role === 'ADMIN'

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)
  const [mutError, setMutError] = useState<string | null>(null)

  const { data: productos = [], isLoading, isError } = useQuery({
    queryKey: ['productos', search],
    queryFn: () => productosApi.getAll({ nombre: search || undefined }),
  })

  const createMut = useMutation({
    mutationFn: (data: ProductoCreate) => productosApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); setModalOpen(false); setMutError(null) },
    onError: (err: Error) => setMutError(err.message),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoUpdate }) => productosApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); setModalOpen(false); setEditing(null); setMutError(null) },
    onError: (err: Error) => setMutError(err.message),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => productosApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  })

  const handleSubmit = (data: ProductoCreate | ProductoUpdate) => {
    if (editing) updateMut.mutate({ id: editing.id, data })
    else createMut.mutate(data as ProductoCreate)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-slate-100">Productos</h1>
          <p className="text-slate-400 text-sm mt-1">Gestión de productos con categorías e ingredientes</p>
        </div>
        {esAdmin && (
          <button onClick={() => { setEditing(null); setMutError(null); setModalOpen(true) }} className="btn-primary">
            + Nuevo producto
          </button>
        )}
      </div>

      <div className="mb-5">
        <input className="input-field max-w-sm" placeholder="Buscar por nombre..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading && <p className="text-slate-400">Cargando...</p>}
      {isError && <p className="text-red-400">Error al cargar los productos.</p>}
      {!isLoading && !isError && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Producto</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Precio</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Categorías</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ingredientes</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {productos.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">Sin resultados</td></tr>
              )}
              {productos.map(p => (
                <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3">
                    <div className="font-medium text-slate-100">{p.nombre}</div>
                    {p.descripcion && <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{p.descripcion}</div>}
                  </td>
                  <td className="py-3 font-medium text-brand-400">${p.precio.toFixed(2)}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.categorias.map(c => (
                        <span key={c.id} className="px-2 py-0.5 bg-brand-900/50 text-brand-300 rounded text-xs">{c.nombre}</span>
                      ))}
                      {p.categorias.length === 0 && <span className="text-slate-500 text-xs">—</span>}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-slate-400 text-xs">{p.ingredientes.length} ingrediente{p.ingredientes.length !== 1 ? 's' : ''}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.activo ? 'bg-green-900/40 text-green-300' : 'bg-slate-800 text-slate-500'}`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/productos/${p.id}`)} className="btn-secondary py-1 px-3">Ver</button>
                      {esAdmin && (
                        <button onClick={() => { setEditing(p); setMutError(null); setModalOpen(true) }} className="btn-secondary py-1 px-3">Editar</button>
                      )}
                      {esAdmin && (
                        <button onClick={() => { if (confirm('¿Eliminar este producto?')) deleteMut.mutate(p.id) }} className="btn-danger py-1 px-3">Eliminar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {esAdmin && (
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setMutError(null) }} title={editing ? 'Editar producto' : 'Nuevo producto'}>
          <ProductoForm initial={editing ?? undefined} onSubmit={handleSubmit} isLoading={createMut.isPending || updateMut.isPending} error={mutError} />
        </Modal>
      )}
    </div>
  )
}
