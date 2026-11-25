# Origami - Gestor de Notas y Tareas Plegables

Proyecto final de la **Técnica en Desarrollo de Software (SENA)**.

Es una aplicación web para guardar notas y tareas. Cada nota es una "hoja": cuando
la terminas la puedes **plegar** (queda tachada y atenuada) y luego **desplegar**
si necesitas volver a ella. También tiene un buscador, filtros por categoría y un
botón "Ver 3D" que muestra una grulla de origami hecha con CSS.

![Captura de la aplicación](captura-app.jpeg)

## Tecnologías

- **Frontend:** React 19 + Vite 8 (CSS normal, sin librerías de 3D)
- **Backend:** Node.js + Express
- **Base de datos:** SQLite (un archivo local) con el ORM **Prisma**
- **Otros:** dotenv y cors

## Qué necesitas

- Node.js 20 o superior

No hace falta instalar ninguna base de datos: SQLite guarda todo en un archivo
dentro del proyecto (`server/prisma/dev.db`).

## Cómo ejecutarlo

### 1. Arrancar el backend

```bash
cd server
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Queda escuchando en `http://localhost:3001`. El comando `npx prisma db push`
crea el archivo `server/prisma/dev.db` con la tabla `hojas`. Al arrancar, si la
tabla está vacía, el servidor inserta 3 notas de ejemplo.

### 2. Arrancar el frontend

En otra terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Abre `http://localhost:5173`.

### En Windows

Hay un archivo `.bat` para hacerlo con doble clic:

- `iniciar-windows.bat`: instala, prepara la base de datos, compila y arranca
  todo en `http://localhost:3001`.

## La API

Base: `http://localhost:3001/api`

| Método | Ruta | Qué hace |
| --- | --- | --- |
| GET | `/hojas` | Lista todas las hojas |
| GET | `/hojas/:id` | Trae una hoja |
| POST | `/hojas` | Crea una hoja |
| PUT | `/hojas/:id` | Actualiza una hoja |
| DELETE | `/hojas/:id` | Borra una hoja |

Son las 5 operaciones del CRUD sobre la entidad `Hoja`. El frontend las llama con
5 `fetch` (uno por operación) desde `client/src/services/hojasService.js`.

Ejemplo con `curl` para crear una hoja:

```bash
curl -X POST http://localhost:3001/api/hojas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Repasar JOIN","contenido":"Practicar INNER y LEFT JOIN.","categoria":"Base de Datos","prioridad":"Alta"}'
```

## La tabla `hojas`

| Campo | Tipo |
| --- | --- |
| `id` | INTEGER AUTOINCREMENT (llave primaria) |
| `titulo` | TEXT |
| `contenido` | TEXT |
| `categoria` | TEXT (Desarrollo, Base de Datos, Estudio, Personal) |
| `prioridad` | TEXT (Baja, Media, Alta) |
| `plegada` | BOOLEAN (0 activa / 1 plegada) |
| `fecha_creacion` | DATETIME |

## Estructura

```
origami/
├── client/    # interfaz (React + Vite)
├── server/    # API (Express + Prisma)
├── iniciar-windows.bat
└── README.md
```

## Autor

Entrega final para el **SENA, Técnica en Desarrollo de Software**.
