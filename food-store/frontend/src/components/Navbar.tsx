import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: '🏠 Inicio' },
  { to: '/productos', label: '🛍 Productos' },
  { to: '/categorias', label: '📂 Categorías' },
  { to: '/ingredientes', label: '🧪 Ingredientes' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <span className="font-bold text-xl tracking-tight">🛒 Food Store</span>
        <ul className="flex gap-2">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === to
                    ? 'bg-blue-900 text-white'
                    : 'hover:bg-blue-600 text-blue-100'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
