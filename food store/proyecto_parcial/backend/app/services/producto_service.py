from typing import List, Optional
from fastapi import HTTPException
from app.models import Producto
from app.schemas import (
    ProductoCreate,
    ProductoUpdate,
    ProductoRead,
    ProductoIngredienteRead,
    CategoriaRead,
)
from app.unit_of_work import UnitOfWork


def _build_read(producto: Producto) -> ProductoRead:
    """Construye la respuesta enriquecida con relaciones."""
    categorias = [
        CategoriaRead(
            id=pc.categoria.id,
            nombre=pc.categoria.nombre,
            descripcion=pc.categoria.descripcion,
            categoria_padre_id=pc.categoria.categoria_padre_id,
        )
        for pc in producto.producto_categorias
        if pc.categoria
    ]
    ingredientes = [
        ProductoIngredienteRead(
            ingrediente_id=pi.ingrediente_id,
            nombre=pi.ingrediente.nombre,
            unidad_medida=pi.ingrediente.unidad_medida,
            cantidad=pi.cantidad,
        )
        for pi in producto.producto_ingredientes
        if pi.ingrediente
    ]
    return ProductoRead(
        id=producto.id,
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio=producto.precio,
        activo=producto.activo,
        categorias=categorias,
        ingredientes=ingredientes,
    )


def get_all(
    uow: UnitOfWork,
    offset: int = 0,
    limit: int = 20,
    nombre: Optional[str] = None,
    activo: Optional[bool] = None,
) -> List[ProductoRead]:
    productos = uow.productos.get_all(
        offset=offset, limit=limit, nombre=nombre, activo=activo
    )
    return [_build_read(p) for p in productos]


def get_by_id(uow: UnitOfWork, producto_id: int) -> ProductoRead:
    producto = uow.productos.get_by_id(producto_id)
    if not producto:
        raise HTTPException(
            status_code=404, detail=f"Producto {producto_id} no encontrado"
        )
    return _build_read(producto)


def create(uow: UnitOfWork, data: ProductoCreate) -> ProductoRead:
    """
    Crea un producto y sus relaciones N:N en UNA sola transacción.
    Si algo falla en el medio, la UoW hace rollback automático.
    """
    producto = Producto(
        nombre=data.nombre,
        descripcion=data.descripcion,
        precio=data.precio,
        activo=data.activo,
    )
    uow.productos.add(producto)
    uow.flush()  # necesario para tener el id

    # Asignar categorías
    for cat_id in data.categoria_ids:
        if not uow.categorias.get_by_id(cat_id):
            raise HTTPException(
                status_code=404, detail=f"Categoría {cat_id} no encontrada"
            )
        uow.productos.add_categoria(producto.id, cat_id)

    # Asignar ingredientes
    for item in data.ingredientes:
        ing_id = item.get("ingrediente_id")
        cantidad = item.get("cantidad", 1.0)
        if not uow.ingredientes.get_by_id(ing_id):
            raise HTTPException(
                status_code=404, detail=f"Ingrediente {ing_id} no encontrado"
            )
        uow.productos.add_ingrediente(producto.id, ing_id, cantidad)

    uow.commit()
    uow.refresh(producto)
    return _build_read(producto)


def update(uow: UnitOfWork, producto_id: int, data: ProductoUpdate) -> ProductoRead:
    producto = uow.productos.get_by_id(producto_id)
    if not producto:
        raise HTTPException(
            status_code=404, detail=f"Producto {producto_id} no encontrado"
        )

    # 1) campos simples
    for field in ["nombre", "descripcion", "precio", "activo"]:
        val = getattr(data, field, None)
        if val is not None:
            setattr(producto, field, val)

    # 2) categorías
    if data.categoria_ids is not None:
        uow.productos.clear_categorias(producto)
        uow.flush()
        uow.refresh(producto)

        for cat_id in data.categoria_ids:
            if not uow.categorias.get_by_id(cat_id):
                raise HTTPException(
                    status_code=404, detail=f"Categoría {cat_id} no encontrada"
                )
            uow.productos.add_categoria(producto_id, cat_id)

    # 3) ingredientes
    if data.ingredientes is not None:
        uow.productos.clear_ingredientes(producto)
        uow.flush()
        uow.refresh(producto)

        for item in data.ingredientes:
            ing_id = (
                item["ingrediente_id"] if isinstance(item, dict) else item.ingrediente_id
            )
            cantidad = (
                item.get("cantidad", 1.0)
                if isinstance(item, dict)
                else (item.cantidad if item.cantidad is not None else 1.0)
            )
            if not uow.ingredientes.get_by_id(ing_id):
                raise HTTPException(
                    status_code=404, detail=f"Ingrediente {ing_id} no encontrado"
                )
            uow.productos.add_ingrediente(producto_id, ing_id, cantidad)

    uow.productos.add(producto)
    uow.commit()
    uow.refresh(producto)
    return _build_read(producto)


def delete(uow: UnitOfWork, producto_id: int) -> None:
    producto = uow.productos.get_by_id(producto_id)
    if not producto:
        raise HTTPException(
            status_code=404, detail=f"Producto {producto_id} no encontrado"
        )

    uow.productos.clear_categorias(producto)
    uow.productos.clear_ingredientes(producto)
    uow.productos.delete(producto)
    uow.commit()
