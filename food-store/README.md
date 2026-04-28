# 🛒 Food Store — Proyecto Integrador

> FastAPI + SQLModel + MySQL (XAMPP) | React + TypeScript + Tailwind CSS 4

---

## 📁 Estructura

```
food-store/
├── backend/          # API REST (FastAPI + SQLModel + MySQL)
└── frontend/         # SPA (React + Vite + TypeScript + Tailwind)
```

---

## 🐍 Backend

### Requisitos
- Python 3.11+
- XAMPP con MySQL corriendo en el puerto 3306

### Pasos

```bash
cd backend

# 1. Crear entorno virtual
python -m venv .venv

# 2. Activar (Windows)
.venv\Scripts\activate
# Activar (Mac/Linux)
source .venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Crear .env (copiar el ejemplo)
cp .env.example .env

# 5. Crear la base de datos en phpMyAdmin
#    CREATE DATABASE food_store CHARACTER SET utf8mb4;

# 6. Levantar el servidor
uvicorn app.main:app --reload --port 8000
```

Docs disponibles en → http://localhost:8000/docs

---

## ⚛️ Frontend

### Requisitos
- Node.js 18 LTS+

### Pasos

```bash
cd frontend

# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
```

App disponible en → http://localhost:5173

---

## ✅ Módulos implementados

| Entidad | Relación | Tipo |
|---|---|---|
| Categoría | Categoría ↔ Producto | N:N |
| ProductoCategoria | Tabla pivot | N:N pivot |
| Producto | Producto ↔ Ingrediente | N:N |
| Ingrediente | Ingrediente ↔ Producto | N:N |
| ProductoIngrediente | Tabla pivot | N:N pivot |
