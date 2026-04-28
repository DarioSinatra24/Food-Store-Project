from typing import Optional
from sqlmodel import SQLModel


class IngredienteCreate(SQLModel):
    nombre: str
    unidad_medida: str
    stock_disponible: float = 0.0
    es_alergeno: bool = False


class IngredienteRead(SQLModel):
    id: int
    nombre: str
    unidad_medida: str
    stock_disponible: float
    es_alergeno: bool


class IngredienteUpdate(SQLModel):
    nombre: Optional[str] = None
    unidad_medida: Optional[str] = None
    stock_disponible: Optional[float] = None
    es_alergeno: Optional[bool] = None
