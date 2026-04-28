from typing import List, Optional
from sqlmodel import Session, select
from app.models.categoria import Categoria
from app.schemas.categoria import CategoriaCreate, CategoriaUpdate
from fastapi import HTTPException, status


def get_all(session: Session, offset: int = 0, limit: int = 20, solo_activas: bool = True) -> List[Categoria]:
    query = select(Categoria)
    if solo_activas:
        query = query.where(Categoria.activo == True)
    return session.exec(query.offset(offset).limit(limit)).all()


def get_by_id(session: Session, categoria_id: int) -> Categoria:
    categoria = session.get(Categoria, categoria_id)
    if not categoria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    return categoria


def create(session: Session, data: CategoriaCreate) -> Categoria:
    categoria = Categoria.model_validate(data)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


def update(session: Session, categoria_id: int, data: CategoriaUpdate) -> Categoria:
    categoria = get_by_id(session, categoria_id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(categoria, key, value)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


def delete(session: Session, categoria_id: int) -> dict:
    categoria = get_by_id(session, categoria_id)
    # Soft delete
    categoria.activo = False
    session.add(categoria)
    session.commit()
    return {"detail": "Categoría desactivada correctamente"}
