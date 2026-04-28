from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .categoria import Categoria
    from .producto import Producto


class ProductoCategoria(SQLModel, table=True):
    """Tabla pivot N:N entre Producto y Categoria."""
    __tablename__ = "producto_categorias"

    producto_id: Optional[int] = Field(
        default=None, foreign_key="productos.id", primary_key=True
    )
    categoria_id: Optional[int] = Field(
        default=None, foreign_key="categorias.id", primary_key=True
    )
    es_principal: bool = Field(default=False)  # campo extra en la pivot

    # Relaciones
    producto: Optional["Producto"] = Relationship(back_populates="categorias_link")
    categoria: Optional["Categoria"] = Relationship(back_populates="productos_link")
