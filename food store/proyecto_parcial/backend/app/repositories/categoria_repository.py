from typing import List, Optional
from sqlmodel import Session, select
from app.models import Categoria
from app.repositories.base_repository import BaseRepository


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def get_all(
        self,
        offset: int = 0,
        limit: int = 20,
        nombre: Optional[str] = None,
    ) -> List[Categoria]:
        query = select(Categoria)
        if nombre:
            query = query.where(Categoria.nombre.contains(nombre))
        return self.session.exec(query.offset(offset).limit(limit)).all()

    def get_raices(self, offset: int = 0, limit: int = 100) -> List[Categoria]:
        """Devuelve solo las categorías que NO tienen padre (categorías raíz)."""
        query = (
            select(Categoria)
            .where(Categoria.categoria_padre_id.is_(None))
            .offset(offset)
            .limit(limit)
        )
        return self.session.exec(query).all()

    def get_subcategorias(self, categoria_id: int) -> List[Categoria]:
        """Devuelve las subcategorías directas de la categoría dada."""
        query = select(Categoria).where(Categoria.categoria_padre_id == categoria_id)
        return self.session.exec(query).all()

    def es_descendiente(self, posible_descendiente_id: int, ancestro_id: int) -> bool:
        """
        Verifica si `posible_descendiente_id` está en el sub-árbol de `ancestro_id`.
        Sirve para validar que no se cree un ciclo al asignar un padre.
        """
        actual = self.get_by_id(posible_descendiente_id)
        while actual is not None and actual.categoria_padre_id is not None:
            if actual.categoria_padre_id == ancestro_id:
                return True
            actual = self.get_by_id(actual.categoria_padre_id)
        return False
