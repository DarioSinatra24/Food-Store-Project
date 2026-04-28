export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  activo: boolean
  imagen_url: string | null
}

export interface Ingrediente {
  id: number
  nombre: string
  unidad_medida: string
  stock_disponible: number
  es_alergeno: boolean
}

// Payloads para crear/actualizar
export interface CategoriaCreate {
  nombre: string
  descripcion?: string
  activo?: boolean
}

export interface ProductoCreate {
  nombre: string
  descripcion?: string
  precio: number
  stock?: number
  activo?: boolean
  imagen_url?: string
}

export interface IngredienteCreate {
  nombre: string
  unidad_medida: string
  stock_disponible?: number
  es_alergeno?: boolean
}
