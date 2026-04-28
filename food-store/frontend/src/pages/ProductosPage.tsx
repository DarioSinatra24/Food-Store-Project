import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProductos, useCrearProducto, useEliminarProducto } from '../hooks/useApi'
import { Spinner, ErrorMsg, Badge } from '../components/UI'
import type { ProductoCreate } from '../types'

const EMPTY: ProductoCreate = { nombre: '', precio: 0, stock: 0, descripcion: '', activo: true }

export default function ProductosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState<ProductoCreate>(EMPTY)
  const [showForm, setShowForm] = useState(false)

  const { data: productos, isLoading, isError } = useProductos({ nombre: busqueda || undefined })
  const crear = useCrearProducto()
  const eliminar = useEliminarProducto()

  function handleSubmit() {
    crear.mutate(form, {
      onSuccess: () => { setForm(EMPTY); setShowForm(false) },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">🛍 Productos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {/* Formulario de creación */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-gray-700">Nuevo Producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border rounded-lg px-3 py-2 text-sm w-full"
              placeholder="Nombre *"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
            />
            <input
              className="border rounded-lg px-3 py-2 text-sm w-full"
              placeholder="Precio *"
              type="number"
              min={0}
              step={0.01}
              value={form.precio}
              onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) })}
            />
            <input
              className="border rounded-lg px-3 py-2 text-sm w-full"
              placeholder="Stock"
              type="number"
              min={0}
              value={form.stock}
              onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })}
            />
            <input
              className="border rounded-lg px-3 py-2 text-sm w-full col-span-2"
              placeholder="Descripción"
              value={form.descripcion ?? ''}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={crear.isPending || !form.nombre}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            {crear.isPending ? 'Guardando...' : 'Guardar'}
          </button>
          {crear.isError && <ErrorMsg message="Error al crear el producto" />}
        </div>
      )}

      {/* Buscador */}
      <input
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
        placeholder="🔍 Buscar productos por nombre..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      {/* Lista */}
      {isLoading && <Spinner />}
      {isError && <ErrorMsg message="No se pudieron cargar los productos. Verificá que el backend esté corriendo." />}
      {productos && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map(p => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/productos/${p.id}`} className="font-semibold text-blue-700 hover:underline">
                  {p.nombre}
                </Link>
                <Badge label={p.activo ? 'Activo' : 'Inactivo'} color={p.activo ? 'green' : 'gray'} />
              </div>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{p.descripcion ?? '—'}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-800">${Number(p.precio).toFixed(2)}</span>
                <span className="text-gray-500">Stock: {p.stock}</span>
              </div>
              <button
                onClick={() => eliminar.mutate(p.id)}
                className="mt-3 text-xs text-red-500 hover:text-red-700"
              >
                Desactivar
              </button>
            </div>
          ))}
          {productos.length === 0 && (
            <p className="col-span-3 text-center text-gray-400 py-8">No se encontraron productos.</p>
          )}
        </div>
      )}
    </div>
  )
}
