from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


# ─────────────────────────────────────────────
# CATEGORIA  (con relación reflexiva: categoría ↔ subcategorías)
# ─────────────────────────────────────────────
class Categoria(SQLModel, table=True):
    __tablename__ = "categorias"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=100, index=True)
    descripcion: Optional[str] = Field(default=None, max_length=255)

    # 🔁 RELACIÓN REFLEXIVA
    # Una categoría puede tener una categoría padre (FK a sí misma)
    categoria_padre_id: Optional[int] = Field(
        default=None,
        foreign_key="categorias.id",
        nullable=True,
    )

    # Categoría padre (lado "muchos a uno")
    padre: Optional["Categoria"] = Relationship(
        back_populates="subcategorias",
        sa_relationship_kwargs={"remote_side": "Categoria.id"},
    )

    # Subcategorías (lado "uno a muchos")
    subcategorias: List["Categoria"] = Relationship(back_populates="padre")

    # 1:N → relaciones con productos
    producto_categorias: List["ProductoCategoria"] = Relationship(back_populates="categoria")


# ─────────────────────────────────────────────
# INGREDIENTE
# ─────────────────────────────────────────────
class Ingrediente(SQLModel, table=True):
    __tablename__ = "ingredientes"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=100, index=True)
    unidad_medida: str = Field(min_length=1, max_length=50)
    stock: float = Field(default=0.0, ge=0)

    producto_ingredientes: List["ProductoIngrediente"] = Relationship(back_populates="ingrediente")


# ─────────────────────────────────────────────
# PRODUCTO
# ─────────────────────────────────────────────
class Producto(SQLModel, table=True):
    __tablename__ = "productos"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=150, index=True)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    precio: float = Field(gt=0)
    activo: bool = Field(default=True)

    producto_categorias: List["ProductoCategoria"] = Relationship(back_populates="producto")
    producto_ingredientes: List["ProductoIngrediente"] = Relationship(back_populates="producto")


# ─────────────────────────────────────────────
# PIVOTE PRODUCTO ↔ CATEGORIA
# ─────────────────────────────────────────────
class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categorias"

    producto_id: Optional[int] = Field(default=None, foreign_key="productos.id", primary_key=True)
    categoria_id: Optional[int] = Field(default=None, foreign_key="categorias.id", primary_key=True)

    producto: Optional[Producto] = Relationship(back_populates="producto_categorias")
    categoria: Optional[Categoria] = Relationship(back_populates="producto_categorias")


# ─────────────────────────────────────────────
# PIVOTE PRODUCTO ↔ INGREDIENTE
# ─────────────────────────────────────────────
class ProductoIngrediente(SQLModel, table=True):
    __tablename__ = "producto_ingredientes"

    producto_id: Optional[int] = Field(default=None, foreign_key="productos.id", primary_key=True)
    ingrediente_id: Optional[int] = Field(default=None, foreign_key="ingredientes.id", primary_key=True)
    cantidad: float = Field(default=1.0, gt=0)

    producto: Optional[Producto] = Relationship(back_populates="producto_ingredientes")
    ingrediente: Optional[Ingrediente] = Relationship(back_populates="producto_ingredientes")


# ─────────────────────────────────────────────
# USUARIO
# ─────────────────────────────────────────────
class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios_db"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(max_length=100, index=True, unique=True)
    password: str = Field(max_length=255)
    rol: str = Field(max_length=20)  # "ADMIN" | "CONSULTA"
