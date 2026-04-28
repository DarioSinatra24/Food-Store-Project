import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriasApi, productosApi, ingredientesApi } from '../services/api'
import type { CategoriaCreate, ProductoCreate, IngredienteCreate } from '../types'

// ── CATEGORÍAS ──────────────────────────────────────────
export function useCategorias(soloActivas = true) {
  return useQuery({
    queryKey: ['categorias', soloActivas],
    queryFn: () => categoriasApi.getAll(soloActivas),
  })
}

export function useCategoria(id: number) {
  return useQuery({
    queryKey: ['categorias', id],
    queryFn: () => categoriasApi.getById(id),
    enabled: !!id,
  })
}

export function useCrearCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CategoriaCreate) => categoriasApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  })
}

export function useEliminarCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoriasApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  })
}

// ── PRODUCTOS ───────────────────────────────────────────
export function useProductos(params?: { nombre?: string; soloActivos?: boolean }) {
  return useQuery({
    queryKey: ['productos', params],
    queryFn: () => productosApi.getAll(params),
  })
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => productosApi.getById(id),
    enabled: !!id,
  })
}

export function useCrearProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProductoCreate) => productosApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] }),
  })
}

export function useActualizarProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductoCreate> }) =>
      productosApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] }),
  })
}

export function useEliminarProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productosApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] }),
  })
}

// ── INGREDIENTES ────────────────────────────────────────
export function useIngredientes(soloAlergenos?: boolean) {
  return useQuery({
    queryKey: ['ingredientes', soloAlergenos],
    queryFn: () => ingredientesApi.getAll(soloAlergenos),
  })
}

export function useIngrediente(id: number) {
  return useQuery({
    queryKey: ['ingredientes', id],
    queryFn: () => ingredientesApi.getById(id),
    enabled: !!id,
  })
}

export function useCrearIngrediente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: IngredienteCreate) => ingredientesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ingredientes'] }),
  })
}

export function useEliminarIngrediente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ingredientesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ingredientes'] }),
  })
}
