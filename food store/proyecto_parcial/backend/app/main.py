from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import categorias, ingredientes, productos, auth
from app.core.database import create_db_and_tables

app = FastAPI()

# ✅ CORS DEBE IR JUSTO DESPUÉS DE CREAR app
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ CREAR TABLAS AL ARRANCAR
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# ❌ LOS ROUTERS VAN DESPUÉS DEL CORS
app.include_router(auth.router)
app.include_router(categorias.router)
app.include_router(ingredientes.router)
app.include_router(productos.router)