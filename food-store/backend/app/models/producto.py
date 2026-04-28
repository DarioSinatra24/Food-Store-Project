from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from decimal import Decimal

if TYPE_CHECKING:
    from .producto_categoria import ProductoCategoria
    from .producto_ingrediente import ProductoIngrediente


class ProductoBase(SQLModel):
    nombre: str = Field(min_length=2, max_length=150, index=True)
    descripcion: Optional[str] = Field(default=None, max_length=1000)
    precio: Decimal = Field(decimal_places=2, max_digits=10, ge=0)
    stock: int = Field(default=0, ge=0)
    activo: bool = Field(default=True)
    imagen_url: Optional[str] = Field(default=None, max_length=500)


class Producto(ProductoBase, table=True):
    __tablename__ = "productos"

    id: Optional[int] = Field(default=None, primary_key=True)

    # N:N con Categoria
    categorias_link: List["ProductoCategoria"] = Relationship(back_populates="producto")

    # N:N con Ingrediente
    ingredientes_link: List["ProductoIngrediente"] = Relationship(back_populates="producto")
