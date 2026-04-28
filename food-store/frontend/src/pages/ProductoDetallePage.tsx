import { useParams, Link } from 'react-router-dom'
import { useProducto } from '../hooks/useApi'
import { Spinner, ErrorMsg, Badge } from '../components/UI'

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { data: producto, isLoading, isError } = useProducto(Number(id))

  if (isLoading) return <Spinner />
  if (isError || !producto) return <ErrorMsg message="Producto no encontrado." />

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/productos" className="text-blue-600 text-sm hover:underline">← Volver a Productos</Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800">{producto.nombre}</h1>
          <Badge label={producto.activo ? 'Activo' : 'Inactivo'} color={producto.activo ? 'green' : 'gray'} />
        </div>

        {producto.descripcion && (
          <p className="text-gray-600">{producto.descripcion}</p>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Precio</p>
            <p className="text-2xl font-bold text-blue-700">${Number(producto.precio).toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Stock disponible</p>
            <p className="text-2xl font-bold text-gray-800">{producto.stock} u.</p>
          </div>
        </div>

        {producto.imagen_url && (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-48 object-cover rounded-xl mt-2"
          />
        )}
      </div>
    </div>
  )
}
