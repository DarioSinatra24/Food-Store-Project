import axios from 'axios'
import type { Categoria, CategoriaCreate, Producto, ProductoCreate, Ingrediente, IngredienteCreate } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── CATEGORÍAS ──────────────────────────────────────────
export const categoriasApi = {
  getAll: (soloActivas = true) =>
    api.get<Categoria[]>('/categorias/', { params: { solo_activas: soloActivas } }).then(r => r.data),

  getById: (id: number) =>
    api.get<Categoria>(`/categorias/${id}`).then(r => r.data),

  create: (data: CategoriaCreate) =>
    api.post<Categoria>('/categorias/', data).then(r => r.data),

  update: (id: number, data: Partial<CategoriaCreate>) =>
    api.patch<Categoria>(`/categorias/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/categorias/${id}`).then(r => r.data),
}

// ── PRODUCTOS ───────────────────────────────────────────
export const productosApi = {
  getAll: (params?: { nombre?: string; soloActivos?: boolean; offset?: number; limit?: number }) =>
    api.get<Producto[]>('/productos/', {
      params: {
        nombre: params?.nombre,
        solo_activos: params?.soloActivos ?? true,
        offset: params?.offset ?? 0,
        limit: params?.limit ?? 20,
      },
    }).then(r => r.data),

  getById: (id: number) =>
    api.get<Producto>(`/productos/${id}`).then(r => r.data),

  create: (data: ProductoCreate) =>
    api.post<Producto>('/productos/', data).then(r => r.data),

  update: (id: number, data: Partial<ProductoCreate>) =>
    api.patch<Producto>(`/productos/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/productos/${id}`).then(r => r.data),
}

// ── INGREDIENTES ────────────────────────────────────────
export const ingredientesApi = {
  getAll: (soloAlergenos?: boolean) =>
    api.get<Ingrediente[]>('/ingredientes/', {
      params: soloAlergenos !== undefined ? { solo_alergenos: soloAlergenos } : {},
    }).then(r => r.data),

  getById: (id: number) =>
    api.get<Ingrediente>(`/ingredientes/${id}`).then(r => r.data),

  create: (data: IngredienteCreate) =>
    api.post<Ingrediente>('/ingredientes/', data).then(r => r.data),

  update: (id: number, data: Partial<IngredienteCreate>) =>
    api.patch<Ingrediente>(`/ingredientes/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/ingredientes/${id}`).then(r => r.data),
}
