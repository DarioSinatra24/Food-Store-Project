from typing import Annotated, Optional, List
from fastapi import APIRouter, Depends, Query, Path, status
from app.core.security import require_admin
from app.schemas import ProductoCreate, ProductoUpdate, ProductoRead
from app.services import producto_service
from app.models import Usuario
from app.unit_of_work import UnitOfWork, get_uow

router = APIRouter(prefix="/productos", tags=["Productos"])

UoWDep = Annotated[UnitOfWork, Depends(get_uow)]


@router.get("/", response_model=List[ProductoRead])
def listar_productos(
    uow: UoWDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    nombre: Annotated[Optional[str], Query()] = None,
    activo: Annotated[Optional[bool], Query()] = None,
):
    return producto_service.get_all(uow, offset, limit, nombre, activo)


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(
    uow: UoWDep,
    producto_id: Annotated[int, Path(ge=1)],
):
    return producto_service.get_by_id(uow, producto_id)


@router.post("/", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto(
    uow: UoWDep,
    data: ProductoCreate,
    user: Usuario = Depends(require_admin),
):
    return producto_service.create(uow, data)


@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(
    uow: UoWDep,
    producto_id: Annotated[int, Path(ge=1)],
    data: ProductoUpdate,
    user: Usuario = Depends(require_admin),
):
    return producto_service.update(uow, producto_id, data)


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    uow: UoWDep,
    producto_id: Annotated[int, Path(ge=1)],
    user: Usuario = Depends(require_admin),
):
    producto_service.delete(uow, producto_id)
