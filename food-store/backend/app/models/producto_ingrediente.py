from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .producto import Producto
    from .ingrediente import Ingrediente


class ProductoIngrediente(SQLModel, table=True):
    """Tabla pivot N:N entre Producto e Ingrediente."""
    __tablename__ = "producto_ingredientes"

    producto_id: Optional[int] = Field(
        default=None, foreign_key="productos.id", primary_key=True
    )
    ingrediente_id: Optional[int] = Field(
        default=None, foreign_key="ingredientes.id", primary_key=True
    )
    cantidad: float = Field(default=1.0, ge=0)  # campo extra: cuánto de este ingrediente
    unidad: str = Field(default="g", max_length=20)

    # Relaciones
    producto: Optional["Producto"] = Relationship(back_populates="ingredientes_link")
    ingrediente: Optional["Ingrediente"] = Relationship(back_populates="productos_link")
