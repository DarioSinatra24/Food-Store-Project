import { useState } from 'react'
import { useIngredientes, useCrearIngrediente, useEliminarIngrediente } from '../hooks/useApi'
import { Spinner, ErrorMsg, Badge } from '../components/UI'
import type { IngredienteCreate } from '../types'

const EMPTY: IngredienteCreate = { nombre: '', unidad_medida: 'g', stock_disponible: 0, es_alergeno: false }

export default function IngredientesPage() {
  const [form, setForm] = useState<IngredienteCreate>(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [filtroAlergeno, setFiltroAlergeno] = useState<boolean | undefined>(undefined)

  const { data: ingredientes, isLoading, isError } = useIngredientes(filtroAlergeno)
  const crear = useCrearIngrediente()
  const eliminar = useEliminarIngrediente()

  function handleSubmit() {
    crear.mutate(form, {
      onSuccess: () => { setForm(EMPTY); setShowForm(false) },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">🧪 Ingredientes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Ingrediente'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-gray-700">Nuevo Ingrediente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border rounded-lg px-3 py-2 text-sm w-full"
              placeholder="Nombre *"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
            />
            <input
              className="border rounded-lg px-3 py-2 text-sm w-full"
              placeholder="Unidad de medida (ej: g, kg, ml)"
              value={form.unidad_medida}
              onChange={e => setForm({ ...form, unidad_medida: e.target.value })}
            />
            <input
              className="border rounded-lg px-3 py-2 text-sm w-full"
              placeholder="Stock disponible"
              type="number"
              min={0}
              step={0.1}
              value={form.stock_disponible}
              onChange={e => setForm({ ...form, stock_disponible: parseFloat(e.target.value) })}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.es_alergeno}
                onChange={e => setForm({ ...form, es_alergeno: e.target.checked })}
                className="w-4 h-4"
              />
              Es alérgeno
            </label>
          </div>
          <button
            onClick={handleSubmit}
            disabled={crear.isPending || !form.nombre}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            {crear.isPending ? 'Guardando...' : 'Guardar'}
          </button>
          {crear.isError && <ErrorMsg message="Error al crear el ingrediente" />}
        </div>
      )}

      {/* Filtro alérgenos */}
      <div className="flex gap-2">
        {[
          { label: 'Todos', val: undefined },
          { label: 'Solo alérgenos', val: true },
          { label: 'Sin alérgenos', val: false },
        ].map(({ label, val }) => (
          <button
            key={label}
            onClick={() => setFiltroAlergeno(val)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filtroAlergeno === val
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading && <Spinner />}
      {isError && <ErrorMsg message="No se pudieron cargar los ingredientes." />}

      {ingredientes && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Unidad</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Alérgeno</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ingredientes.map(i => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{i.nombre}</td>
                  <td className="px-4 py-3 text-gray-500">{i.unidad_medida}</td>
                  <td className="px-4 py-3 text-gray-700">{i.stock_disponible}</td>
                  <td className="px-4 py-3">
                    {i.es_alergeno
                      ? <Badge label="Alérgeno" color="red" />
                      : <Badge label="No" color="gray" />}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => eliminar.mutate(i.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {ingredientes.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Sin ingredientes registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
