import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriasApi } from '../api'
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types'
import Modal from '../components/Modal'

interface FormProps {
  initial?: Categoria
  onSubmit: (data: CategoriaCreate | CategoriaUpdate) => void
  isLoading: boolean
  error: string | null
}

function CategoriaForm({ initial, onSubmit, isLoading, error }: FormProps) {
  const [nombre, setNombre] = useState(initial?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ nombre: nombre.trim(), descripcion: descripcion.trim() || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Nombre *</label>
        <input
          className="input-field"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ej: Bebidas"
          required
          minLength={2}
          maxLength={100}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Descripción</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción opcional..."
          maxLength={255}
        />
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

export default function CategoriasPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Categoria | null>(null)
  const [mutError, setMutError] = useState<string | null>(null)

  // useQuery — listado
  const { data: categorias = [], isLoading, isError } = useQuery({
    queryKey: ['categorias', search],
    queryFn: () => categoriasApi.getAll({ nombre: search || undefined }),
  })

  // useMutation — crear
  const createMut = useMutation({
    mutationFn: (data: CategoriaCreate) => categoriasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] }) // invalidación de caché
      setModalOpen(false)
      setMutError(null)
    },
    onError: (err: Error) => setMutError(err.message),
  })

  // useMutation — editar
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaUpdate }) => categoriasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setModalOpen(false)
      setEditing(null)
      setMutError(null)
    },
    onError: (err: Error) => setMutError(err.message),
  })

  // useMutation — eliminar
  const deleteMut = useMutation({
    mutationFn: (id: number) => categoriasApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
  })

  const openCreate = () => { setEditing(null); setMutError(null); setModalOpen(true) }
  const openEdit = (c: Categoria) => { setEditing(c); setMutError(null); setModalOpen(true) }

  const handleSubmit = (data: CategoriaCreate | CategoriaUpdate) => {
    if (editing) updateMut.mutate({ id: editing.id, data })
    else createMut.mutate(data as CategoriaCreate)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-slate-100">Categorías</h1>
          <p className="text-slate-400 text-sm mt-1">Gestión de categorías de productos</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Nueva categoría</button>
      </div>

      {/* Buscador con filtro */}
      <div className="mb-5">
        <input
          className="input-field max-w-sm"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla */}
      {isLoading && <p className="text-slate-400">Cargando...</p>}
      {isError && <p className="text-red-400">Error al cargar las categorías.</p>}
      {!isLoading && !isError && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Descripción</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categorias.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-slate-500">Sin resultados</td></tr>
              )}
              {categorias.map(cat => (
                <tr key={cat.id} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3 text-slate-500">{cat.id}</td>
                  <td className="py-3 font-medium text-slate-100">{cat.nombre}</td>
                  <td className="py-3 text-slate-400">{cat.descripcion ?? '—'}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(cat)} className="btn-secondary py-1 px-3">Editar</button>
                      <button
                        onClick={() => { if (confirm('¿Eliminar esta categoría?')) deleteMut.mutate(cat.id) }}
                        className="btn-danger py-1 px-3"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal alta/edición */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setMutError(null) }}
        title={editing ? 'Editar categoría' : 'Nueva categoría'}
      >
        <CategoriaForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          isLoading={createMut.isPending || updateMut.isPending}
          error={mutError}
        />
      </Modal>
    </div>
  )
}
