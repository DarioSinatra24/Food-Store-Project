from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, Query, Path, status
from sqlmodel import Session
from app.database import get_session
from app.schemas.producto import ProductoCreate, ProductoRead, ProductoUpdate
from app.services import producto_service

router = APIRouter(prefix="/productos", tags=["Productos"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=List[ProductoRead])
def listar_productos(
    session: SessionDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    nombre: Annotated[Optional[str], Query(min_length=1, max_length=100)] = None,
    solo_activos: bool = True,
):
    return producto_service.get_all(session, offset=offset, limit=limit, nombre=nombre, solo_activos=solo_activos)


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(
    session: SessionDep,
    producto_id: Annotated[int, Path(ge=1)],
):
    return producto_service.get_by_id(session, producto_id)


@router.post("/", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto(session: SessionDep, data: ProductoCreate):
    return producto_service.create(session, data)


@router.patch("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(
    session: SessionDep,
    producto_id: Annotated[int, Path(ge=1)],
    data: ProductoUpdate,
):
    return producto_service.update(session, producto_id, data)


@router.delete("/{producto_id}")
def eliminar_producto(
    session: SessionDep,
    producto_id: Annotated[int, Path(ge=1)],
):
    return producto_service.delete(session, producto_id)
