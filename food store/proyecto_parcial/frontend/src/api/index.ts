import type {
  Categoria, CategoriaCreate, CategoriaUpdate,
  Ingrediente, IngredienteCreate, IngredienteUpdate,
  Producto, ProductoCreate, ProductoUpdate,
} from '../types';

const BASE_URL = 'http://localhost:8000';

// Lee el token guardado en localStorage por AuthContext
function getToken(): string | null {
  const stored = localStorage.getItem('auth_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored).token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Si hay token lo manda siempre; el backend decide si lo necesita o no
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const text = await res.text();
  let data: any;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    console.error('API ERROR:', data);
    throw new Error(data?.detail || 'Error en la solicitud');
  }

  return data as T;
}

// ─── Categorias ──────────────────────────────────────────
export const categoriasApi = {
  getAll: (params?: { nombre?: string; offset?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.nombre) qs.set('nombre', params.nombre);
    if (params?.offset !== undefined) qs.set('offset', String(params.offset));
    if (params?.limit !== undefined) qs.set('limit', String(params.limit));
    return request<Categoria[]>(`/categorias/?${qs}`);
  },
  getById: (id: number) => request<Categoria>(`/categorias/${id}`),
  create: (data: CategoriaCreate) => request<Categoria>('/categorias/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: CategoriaUpdate) => request<Categoria>(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/categorias/${id}`, { method: 'DELETE' }),
};

// ─── Ingredientes ────────────────────────────────────────
export const ingredientesApi = {
  getAll: (params?: { nombre?: string; offset?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.nombre) qs.set('nombre', params.nombre);
    if (params?.offset !== undefined) qs.set('offset', String(params.offset));
    if (params?.limit !== undefined) qs.set('limit', String(params.limit));
    return request<Ingrediente[]>(`/ingredientes/?${qs}`);
  },
  getById: (id: number) => request<Ingrediente>(`/ingredientes/${id}`),
  create: (data: IngredienteCreate) => request<Ingrediente>('/ingredientes/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: IngredienteUpdate) => request<Ingrediente>(`/ingredientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/ingredientes/${id}`, { method: 'DELETE' }),
};

// ─── Productos ───────────────────────────────────────────
export const productosApi = {
  getAll: (params?: { nombre?: string; activo?: boolean; offset?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.nombre) qs.set('nombre', params.nombre);
    if (params?.activo !== undefined) qs.set('activo', String(params.activo));
    if (params?.offset !== undefined) qs.set('offset', String(params.offset));
    if (params?.limit !== undefined) qs.set('limit', String(params.limit));
    return request<Producto[]>(`/productos/?${qs}`);
  },
  getById: (id: number) => request<Producto>(`/productos/${id}`),
  create: (data: ProductoCreate) => request<Producto>('/productos/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: ProductoUpdate) => request<Producto>(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/productos/${id}`, { method: 'DELETE' }),
};
