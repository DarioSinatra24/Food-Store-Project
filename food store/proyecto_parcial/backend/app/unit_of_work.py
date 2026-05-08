from sqlmodel import Session
from app.core.database import engine
from app.repositories import (
    CategoriaRepository,
    IngredienteRepository,
    ProductoRepository,
    UsuarioRepository,
)


class UnitOfWork:
    """
    Coordina una transacción a través de varios repositorios.
    Patrón: un solo `commit()` por operación de negocio.
    Uso recomendado:
        with UnitOfWork() as uow:
            uow.categorias.add(...)
            uow.productos.add(...)
            uow.commit()
    """

    def __init__(self):
        self.session: Session | None = None
        self.categorias: CategoriaRepository | None = None
        self.ingredientes: IngredienteRepository | None = None
        self.productos: ProductoRepository | None = None
        self.usuarios: UsuarioRepository | None = None

    def __enter__(self) -> "UnitOfWork":
        self.session = Session(engine)
        self.categorias = CategoriaRepository(self.session)
        self.ingredientes = IngredienteRepository(self.session)
        self.productos = ProductoRepository(self.session)
        self.usuarios = UsuarioRepository(self.session)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Si hubo excepción → rollback automático.
        if exc_type is not None:
            self.rollback()
        self.session.close()

    def commit(self) -> None:
        self.session.commit()

    def rollback(self) -> None:
        self.session.rollback()

    def flush(self) -> None:
        self.session.flush()

    def refresh(self, entity) -> None:
        self.session.refresh(entity)


def get_uow():
    """Dependencia FastAPI para inyectar la UoW en los routers."""
    with UnitOfWork() as uow:
        yield uow
