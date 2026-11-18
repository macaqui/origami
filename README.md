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
- **Base de datos:** MySQL / MariaDB con el ORM **Prisma**
- **Otros:** dotenv y cors

## Qué necesitas

- Node.js 20 o superior
- MySQL 8 o MariaDB

## Cómo ejecutarlo

### 1. Crear la base de datos (solo la primera vez)

```bash
mysql -u root -p < server/database.sql
```

Eso crea la base `origami_db`, la tabla `hojas`, 3 notas de ejemplo y el usuario
`origami` que usa la aplicación.

### 2. Arrancar el backend

```bash
cd server
cp .env.example .env
npm install
npx prisma generate
npm run dev
```

Queda escuchando en `http://localhost:3001`.

### 3. Arrancar el frontend

En otra terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Abre `http://localhost:5173`.

### En Windows

Hay dos archivos `.bat` para hacerlo con doble clic:

- `preparar-base-de-datos.bat`: la primera vez, para crear la base.
- `iniciar-windows.bat`: cada vez, instala, compila y arranca todo en
  `http://localhost:3001`.

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
| `id` | INT AUTO_INCREMENT (llave primaria) |
| `titulo` | VARCHAR(120) |
| `contenido` | TEXT |
| `categoria` | VARCHAR(50) (Desarrollo, Base de Datos, Estudio, Personal) |
| `prioridad` | VARCHAR(20) (Baja, Media, Alta) |
| `plegada` | BOOLEAN (0 activa / 1 plegada) |
| `fecha_creacion` | TIMESTAMP |

## Estructura

```
origami/
├── client/    # interfaz (React + Vite)
├── server/    # API (Express + Prisma)
├── iniciar-windows.bat
├── preparar-base-de-datos.bat
└── README.md
```

## Autor

Entrega final para el **SENA, Técnica en Desarrollo de Software**.
