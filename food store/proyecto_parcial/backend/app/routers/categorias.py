from typing import Annotated, Optional, List
from fastapi import APIRouter, Depends, Query, Path, status
from app.schemas import (
    CategoriaCreate,
    CategoriaUpdate,
    CategoriaRead,
    CategoriaConHijosRead,
)
from app.services import categoria_service
from app.unit_of_work import UnitOfWork, get_uow

router = APIRouter(prefix="/categorias", tags=["Categorías"])

UoWDep = Annotated[UnitOfWork, Depends(get_uow)]


@router.get("/", response_model=List[CategoriaRead])
def listar_categorias(
    uow: UoWDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    nombre: Annotated[Optional[str], Query()] = None,
):
    return categoria_service.get_all(uow, offset, limit, nombre)


@router.get("/arbol", response_model=List[CategoriaConHijosRead])
def listar_arbol_categorias(uow: UoWDep):
    """Devuelve todas las categorías raíz con sus subcategorías anidadas."""
    return categoria_service.get_arbol(uow)


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(
    uow: UoWDep,
    categoria_id: Annotated[int, Path(ge=1)],
):
    return categoria_service.get_by_id(uow, categoria_id)


@router.get("/{categoria_id}/subcategorias", response_model=List[CategoriaRead])
def listar_subcategorias(
    uow: UoWDep,
    categoria_id: Annotated[int, Path(ge=1)],
):
    """Devuelve las subcategorías directas de una categoría."""
    return categoria_service.get_subcategorias(uow, categoria_id)


@router.post("/", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(uow: UoWDep, data: CategoriaCreate):
    return categoria_service.create(uow, data)


@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(
    uow: UoWDep,
    categoria_id: Annotated[int, Path(ge=1)],
    data: CategoriaUpdate,
):
    return categoria_service.update(uow, categoria_id, data)


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(
    uow: UoWDep,
    categoria_id: Annotated[int, Path(ge=1)],
):
    categoria_service.delete(uow, categoria_id)
