from typing import Annotated, List
from fastapi import APIRouter, Depends, Query, Path, status
from sqlmodel import Session
from app.database import get_session
from app.schemas.categoria import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.services import categoria_service

router = APIRouter(prefix="/categorias", tags=["Categorías"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=List[CategoriaRead])
def listar_categorias(
    session: SessionDep,
    offset: Annotated[int, Query(ge=0, description="Número de registros a omitir")] = 0,
    limit: Annotated[int, Query(ge=1, le=100, description="Máx. registros a devolver")] = 20,
    solo_activas: bool = True,
):
    return categoria_service.get_all(session, offset=offset, limit=limit, solo_activas=solo_activas)


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(
    session: SessionDep,
    categoria_id: Annotated[int, Path(ge=1)],
):
    return categoria_service.get_by_id(session, categoria_id)


@router.post("/", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(session: SessionDep, data: CategoriaCreate):
    return categoria_service.create(session, data)


@router.patch("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(
    session: SessionDep,
    categoria_id: Annotated[int, Path(ge=1)],
    data: CategoriaUpdate,
):
    return categoria_service.update(session, categoria_id, data)


@router.delete("/{categoria_id}", status_code=status.HTTP_200_OK)
def eliminar_categoria(
    session: SessionDep,
    categoria_id: Annotated[int, Path(ge=1)],
):
    return categoria_service.delete(session, categoria_id)
