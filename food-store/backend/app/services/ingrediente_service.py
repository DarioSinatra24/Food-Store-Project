from typing import List, Optional
from sqlmodel import Session, select
from app.models.ingrediente import Ingrediente
from app.schemas.ingrediente import IngredienteCreate, IngredienteUpdate
from fastapi import HTTPException, status


def get_all(
    session: Session,
    offset: int = 0,
    limit: int = 20,
    solo_alergenos: Optional[bool] = None,
) -> List[Ingrediente]:
    query = select(Ingrediente)
    if solo_alergenos is not None:
        query = query.where(Ingrediente.es_alergeno == solo_alergenos)
    return session.exec(query.offset(offset).limit(limit)).all()


def get_by_id(session: Session, ingrediente_id: int) -> Ingrediente:
    ingrediente = session.get(Ingrediente, ingrediente_id)
    if not ingrediente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingrediente no encontrado")
    return ingrediente


def create(session: Session, data: IngredienteCreate) -> Ingrediente:
    ingrediente = Ingrediente.model_validate(data)
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente


def update(session: Session, ingrediente_id: int, data: IngredienteUpdate) -> Ingrediente:
    ingrediente = get_by_id(session, ingrediente_id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ingrediente, key, value)
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente


def delete(session: Session, ingrediente_id: int) -> dict:
    ingrediente = get_by_id(session, ingrediente_id)
    session.delete(ingrediente)
    session.commit()
    return {"detail": "Ingrediente eliminado correctamente"}
