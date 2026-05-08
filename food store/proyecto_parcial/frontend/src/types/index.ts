// ─── Categoria ───────────────────────────────────────────
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string;
}

export interface CategoriaUpdate {
  nombre?: string;
  descripcion?: string;
}

// ─── Ingrediente ─────────────────────────────────────────
export interface Ingrediente {
  id: number;
  nombre: string;
  unidad_medida: string;
  stock: number;
}

export interface IngredienteCreate {
  nombre: string;
  unidad_medida: string;
  stock: number;
}

export interface IngredienteUpdate {
  nombre?: string;
  unidad_medida?: string;
  stock?: number;
}

// ─── Producto ────────────────────────────────────────────
export interface ProductoIngredienteItem {
  ingrediente_id: number;
  nombre: string;
  unidad_medida: string;
  cantidad: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  activo: boolean;
  categorias: Categoria[];
  ingredientes: ProductoIngredienteItem[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string;
  precio: number;
  activo: boolean;
  categoria_ids: number[];
  ingredientes: { ingrediente_id: number; cantidad: number }[];
}

export interface ProductoUpdate {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
  categoria_ids?: number[];
  ingredientes?: { ingrediente_id: number; cantidad: number }[];
}
