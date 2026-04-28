import { Link } from 'react-router-dom'

const cards = [
  { to: '/productos', emoji: '🛍', title: 'Productos', desc: 'Gestión del catálogo de productos', color: 'bg-blue-50 border-blue-200' },
  { to: '/categorias', emoji: '📂', title: 'Categorías', desc: 'Organización por categorías', color: 'bg-green-50 border-green-200' },
  { to: '/ingredientes', emoji: '🧪', title: 'Ingredientes', desc: 'Control de ingredientes y alérgenos', color: 'bg-yellow-50 border-yellow-200' },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">🛒 Food Store</h1>
        <p className="text-gray-500 text-lg">Panel de administración del catálogo de productos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ to, emoji, title, desc, color }) => (
          <Link
            key={to}
            to={to}
            className={`border-2 rounded-xl p-6 ${color} hover:shadow-md transition-shadow`}
          >
            <div className="text-4xl mb-3">{emoji}</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{title}</h2>
            <p className="text-gray-600 text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
