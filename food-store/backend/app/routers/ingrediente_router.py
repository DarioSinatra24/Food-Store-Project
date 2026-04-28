from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, Query, Path, status
from sqlmodel import Session
from app.database import get_session
from app.schemas.ingrediente import IngredienteCreate, IngredienteRead, IngredienteUpdate
from app.services import ingrediente_service

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=List[IngredienteRead])
def listar_ingredientes(
    session: SessionDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    solo_alergenos: Annotated[Optional[bool], Query(description="Filtrar solo alérgenos")] = None,
):
    return ingrediente_service.get_all(session, offset=offset, limit=limit, solo_alergenos=solo_alergenos)


@router.get("/{ingrediente_id}", response_model=IngredienteRead)
def obtener_ingrediente(
    session: SessionDep,
    ingrediente_id: Annotated[int, Path(ge=1)],
):
    return ingrediente_service.get_by_id(session, ingrediente_id)


@router.post("/", response_model=IngredienteRead, status_code=status.HTTP_201_CREATED)
def crear_ingrediente(session: SessionDep, data: IngredienteCreate):
    return ingrediente_service.create(session, data)


@router.patch("/{ingrediente_id}", response_model=IngredienteRead)
def actualizar_ingrediente(
    session: SessionDep,
    ingrediente_id: Annotated[int, Path(ge=1)],
    data: IngredienteUpdate,
):
    return ingrediente_service.update(session, ingrediente_id, data)


@router.delete("/{ingrediente_id}")
def eliminar_ingrediente(
    session: SessionDep,
    ingrediente_id: Annotated[int, Path(ge=1)],
):
    return ingrediente_service.delete(session, ingrediente_id)
