from typing import List, Optional
from fastapi import HTTPException, status
from app.models import Categoria
from app.schemas import CategoriaCreate, CategoriaUpdate, CategoriaConHijosRead
from app.unit_of_work import UnitOfWork


def get_all(
    uow: UnitOfWork,
    offset: int = 0,
    limit: int = 20,
    nombre: Optional[str] = None,
) -> List[Categoria]:
    return uow.categorias.get_all(offset=offset, limit=limit, nombre=nombre)


def get_by_id(uow: UnitOfWork, categoria_id: int) -> Categoria:
    categoria = uow.categorias.get_by_id(categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría {categoria_id} no encontrada",
        )
    return categoria


def get_subcategorias(uow: UnitOfWork, categoria_id: int) -> List[Categoria]:
    # valida que exista
    get_by_id(uow, categoria_id)
    return uow.categorias.get_subcategorias(categoria_id)


def get_arbol(uow: UnitOfWork) -> List[CategoriaConHijosRead]:
    """Devuelve todas las categorías raíz con sus subcategorías anidadas."""
    raices = uow.categorias.get_raices()
    return [_to_arbol(c) for c in raices]


def _to_arbol(categoria: Categoria) -> CategoriaConHijosRead:
    return CategoriaConHijosRead(
        id=categoria.id,
        nombre=categoria.nombre,
        descripcion=categoria.descripcion,
        categoria_padre_id=categoria.categoria_padre_id,
        subcategorias=[_to_arbol(sub) for sub in categoria.subcategorias],
    )


def create(uow: UnitOfWork, data: CategoriaCreate) -> Categoria:
    # Validar padre si vino
    if data.categoria_padre_id is not None:
        padre = uow.categorias.get_by_id(data.categoria_padre_id)
        if not padre:
            raise HTTPException(
                status_code=404,
                detail=f"Categoría padre {data.categoria_padre_id} no encontrada",
            )

    categoria = Categoria(**data.model_dump())
    uow.categorias.add(categoria)
    uow.commit()
    uow.refresh(categoria)
    return categoria


def update(uow: UnitOfWork, categoria_id: int, data: CategoriaUpdate) -> Categoria:
    categoria = get_by_id(uow, categoria_id)
    update_data = data.model_dump(exclude_unset=True)

    # Validaciones para la relación reflexiva
    if "categoria_padre_id" in update_data:
        nuevo_padre_id = update_data["categoria_padre_id"]

        if nuevo_padre_id is not None:
            # No puede ser su propio padre
            if nuevo_padre_id == categoria_id:
                raise HTTPException(
                    status_code=400,
                    detail="Una categoría no puede ser su propia categoría padre",
                )
            # El padre debe existir
            padre = uow.categorias.get_by_id(nuevo_padre_id)
            if not padre:
                raise HTTPException(
                    status_code=404,
                    detail=f"Categoría padre {nuevo_padre_id} no encontrada",
                )
            # Evitar ciclos: el nuevo padre no puede ser descendiente de esta categoría
            if uow.categorias.es_descendiente(nuevo_padre_id, categoria_id):
                raise HTTPException(
                    status_code=400,
                    detail="No se puede asignar una subcategoría como padre (se generaría un ciclo)",
                )

    for key, value in update_data.items():
        setattr(categoria, key, value)

    uow.categorias.add(categoria)
    uow.commit()
    uow.refresh(categoria)
    return categoria


def delete(uow: UnitOfWork, categoria_id: int) -> None:
    categoria = get_by_id(uow, categoria_id)

    # No permitir borrar si tiene subcategorías
    if categoria.subcategorias:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar una categoría que tiene subcategorías",
        )

    uow.categorias.delete(categoria)
    uow.commit()
