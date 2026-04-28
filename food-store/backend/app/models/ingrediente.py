from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .producto_ingrediente import ProductoIngrediente


class IngredienteBase(SQLModel):
    nombre: str = Field(min_length=2, max_length=100, index=True)
    unidad_medida: str = Field(min_length=1, max_length=20)  # ej: kg, g, lt, ml
    stock_disponible: float = Field(default=0.0, ge=0)
    es_alergeno: bool = Field(default=False)


class Ingrediente(IngredienteBase, table=True):
    __tablename__ = "ingredientes"

    id: Optional[int] = Field(default=None, primary_key=True)

    # N:N con Producto
    productos_link: List["ProductoIngrediente"] = Relationship(back_populates="ingrediente")
