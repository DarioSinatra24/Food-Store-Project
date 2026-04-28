from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .producto_categoria import ProductoCategoria


class CategoriaBase(SQLModel):
    nombre: str = Field(min_length=2, max_length=100, index=True)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    activo: bool = Field(default=True)


class Categoria(CategoriaBase, table=True):
    __tablename__ = "categorias"

    id: Optional[int] = Field(default=None, primary_key=True)

    # Relación N:N con Producto a través de ProductoCategoria
    productos_link: List["ProductoCategoria"] = Relationship(back_populates="categoria")
