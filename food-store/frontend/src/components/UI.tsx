// Spinner de carga
export function Spinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
    </div>
  )
}

// Mensaje de error
export function ErrorMsg({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
      ⚠ {message}
    </div>
  )
}

// Badge genérico
export function Badge({ label, color = 'blue' }: { label: string; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-700',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color] ?? colors.blue}`}>
      {label}
    </span>
  )
}
