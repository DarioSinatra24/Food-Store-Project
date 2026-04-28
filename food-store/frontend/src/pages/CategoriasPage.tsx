import { useState } from 'react'
import { useCategorias, useCrearCategoria, useEliminarCategoria } from '../hooks/useApi'
import { Spinner, ErrorMsg, Badge } from '../components/UI'
import type { CategoriaCreate } from '../types'

const EMPTY: CategoriaCreate = { nombre: '', descripcion: '', activo: true }

export default function CategoriasPage() {
  const [form, setForm] = useState<CategoriaCreate>(EMPTY)
  const [showForm, setShowForm] = useState(false)

  const { data: categorias, isLoading, isError } = useCategorias(false)
  const crear = useCrearCategoria()
  const eliminar = useEliminarCategoria()

  function handleSubmit() {
    crear.mutate(form, {
      onSuccess: () => { setForm(EMPTY); setShowForm(false) },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">📂 Categorías</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {showForm ? 'Cancelar' : '+ Nueva Categoría'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-gray-700">Nueva Categoría</h2>
          <input
            className="border rounded-lg px-3 py-2 text-sm w-full"
            placeholder="Nombre *"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            className="border rounded-lg px-3 py-2 text-sm w-full"
            placeholder="Descripción"
            value={form.descripcion ?? ''}
            onChange={e => setForm({ ...form, descripcion: e.target.value })}
          />
          <button
            onClick={handleSubmit}
            disabled={crear.isPending || !form.nombre}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            {crear.isPending ? 'Guardando...' : 'Guardar'}
          </button>
          {crear.isError && <ErrorMsg message="Error al crear la categoría" />}
        </div>
      )}

      {isLoading && <Spinner />}
      {isError && <ErrorMsg message="No se pudieron cargar las categorías." />}

      {categorias && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categorias.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{c.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{c.nombre}</td>
                  <td className="px-4 py-3 text-gray-500">{c.descripcion ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge label={c.activo ? 'Activa' : 'Inactiva'} color={c.activo ? 'green' : 'gray'} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => eliminar.mutate(c.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Sin categorías registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
