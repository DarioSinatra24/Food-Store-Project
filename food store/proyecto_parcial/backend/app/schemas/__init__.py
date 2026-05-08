from typing import Optional, List
from pydantic import BaseModel, field_validator


# ─────────────────────────────────────────────
# CATEGORIA SCHEMAS
# ─────────────────────────────────────────────
class CategoriaCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    categoria_padre_id: Optional[int] = None  # 🔁 padre opcional

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v.strip()


class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    categoria_padre_id: Optional[int] = None


class CategoriaRead(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    categoria_padre_id: Optional[int] = None

    model_config = {"from_attributes": True}


class CategoriaConHijosRead(CategoriaRead):
    """Versión con árbol de subcategorías (para endpoints jerárquicos)."""
    subcategorias: List["CategoriaConHijosRead"] = []


CategoriaConHijosRead.model_rebuild()


# ─────────────────────────────────────────────
# INGREDIENTE SCHEMAS
# ─────────────────────────────────────────────
class IngredienteCreate(BaseModel):
    nombre: str
    unidad_medida: str
    stock: float = 0.0

    @field_validator("nombre", "unidad_medida")
    @classmethod
    def no_vacio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El campo no puede estar vacío")
        return v.strip()

    @field_validator("stock")
    @classmethod
    def stock_positivo(cls, v: float) -> float:
        if v < 0:
            raise ValueError("El stock no puede ser negativo")
        return v


class IngredienteUpdate(BaseModel):
    nombre: Optional[str] = None
    unidad_medida: Optional[str] = None
    stock: Optional[float] = None


class IngredienteRead(BaseModel):
    id: int
    nombre: str
    unidad_medida: str
    stock: float

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────
# PRODUCTO SCHEMAS
# ─────────────────────────────────────────────
class ProductoIngredienteRead(BaseModel):
    ingrediente_id: int
    nombre: str
    unidad_medida: str
    cantidad: float

    model_config = {"from_attributes": True}


class ProductoCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    activo: bool = True
    categoria_ids: List[int] = []
    ingredientes: List[dict] = []  # [{ingrediente_id, cantidad}]

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v.strip()

    @field_validator("precio")
    @classmethod
    def precio_positivo(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("El precio debe ser mayor a 0")
        return v


class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = None
    activo: Optional[bool] = None
    categoria_ids: Optional[List[int]] = None
    ingredientes: Optional[List[dict]] = None


class ProductoRead(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    activo: bool
    categorias: List[CategoriaRead] = []
    ingredientes: List[ProductoIngredienteRead] = []

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────
# AUTH SCHEMAS
# ─────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    rol: str
    username: str
