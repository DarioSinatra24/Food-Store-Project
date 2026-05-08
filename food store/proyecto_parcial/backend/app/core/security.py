from fastapi import Depends, HTTPException, status
from app.routers.auth import get_current_user
from app.models import Usuario


def require_admin(user: Usuario = Depends(get_current_user)) -> Usuario:
    if user.rol != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado. Se requiere rol ADMIN.",
        )
    return user
