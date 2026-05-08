from typing import Optional
from sqlmodel import Session, select
from app.models import Usuario
from app.repositories.base_repository import BaseRepository


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session):
        super().__init__(session, Usuario)

    def get_by_username(self, username: str) -> Optional[Usuario]:
        return self.session.exec(
            select(Usuario).where(Usuario.username == username)
        ).first()
