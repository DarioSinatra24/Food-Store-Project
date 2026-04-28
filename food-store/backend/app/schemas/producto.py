from typing import Optional, List
from decimal import Decimal
from sqlmodel import SQLModel
from .categoria import CategoriaRead


class ProductoCreate(SQLModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: Decimal
    stock: int = 0
    activo: bool = True
    imagen_url: Optional[str] = None


class ProductoRead(SQLModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio: Decimal
    stock: int
    activo: bool
    imagen_url: Optional[str] = None


class ProductoReadDetalle(ProductoRead):
    categorias: List[CategoriaRead] = []


class ProductoUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[Decimal] = None
    stock: Optional[int] = None
    activo: Optional[bool] = None
    imagen_url: Optional[str] = None
