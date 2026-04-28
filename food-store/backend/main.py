from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.routers import categoria_router, producto_router, ingrediente_router

app = FastAPI(
    title="Food Store API",
    description="API REST para el catálogo de productos de Food Store",
    version="1.0.0",
)

# CORS — permite peticiones desde el frontend en desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


# Registrar routers
app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(ingrediente_router)


@app.get("/", tags=["Root"])
def root():
    return {"message": "Food Store API funcionando 🚀", "docs": "/docs"}
