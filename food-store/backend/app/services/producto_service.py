from typing import List, Optional
from sqlmodel import Session, select
from app.models.producto import Producto
from app.schemas.producto import ProductoCreate, ProductoUpdate
from fastapi import HTTPException, status


def get_all(
    session: Session,
    offset: int = 0,
    limit: int = 20,
    nombre: Optional[str] = None,
    solo_activos: bool = True,
) -> List[Producto]:
    query = select(Producto)
    if solo_activos:
        query = query.where(Producto.activo == True)
    if nombre:
        query = query.where(Producto.nombre.contains(nombre))
    return session.exec(query.offset(offset).limit(limit)).all()


def get_by_id(session: Session, producto_id: int) -> Producto:
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto


def create(session: Session, data: ProductoCreate) -> Producto:
    producto = Producto.model_validate(data)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def update(session: Session, producto_id: int, data: ProductoUpdate) -> Producto:
    producto = get_by_id(session, producto_id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(producto, key, value)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def delete(session: Session, producto_id: int) -> dict:
    producto = get_by_id(session, producto_id)
    producto.activo = False
    session.add(producto)
    session.commit()
    return {"detail": "Producto desactivado correctamente"}
