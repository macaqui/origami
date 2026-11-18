# Despliegue y demo

Tres formas de mostrar Origami, de la más segura a la más "profesional". Usa la
**A** como plan principal y la **B** como as bajo la manga.

| Plan | ¿Necesitas cuentas? | ¿Necesitas internet? | Duración | Para qué sirve |
| --- | --- | --- | --- | --- |
| **A. Demo local** | No | No | Siempre | Ejecutar en tu PC (lo más seguro) |
| **A2. Windows** | No | Solo la primera vez | Siempre | Ejecutar en otro PC con Windows (ver abajo) |
| **B. Túnel público** | No | Sí | Mientras la terminal esté abierta | Dar una URL que cualquiera abre en su celular |
| **C. Nube permanente** | Sí (2) | Sí | Permanente | Que la página viva sin tu PC |

> **Idea clave:** el backend de Origami ya puede **servir la interfaz compilada**
> (`client/dist`). Por eso, con un solo comando, la interfaz y la API quedan en la
> **misma URL y el mismo origen**, y así no hay que pelear con CORS ni con dos
> direcciones distintas.

---

## Plan A — Demo local (la de siempre, garantizada)

```bash
# 1. Base de datos (una sola vez)
systemctl status mariadb          # si está caída: sudo systemctl start mariadb

# 2. Backend (terminal 1)
cd server
npm install
npx prisma generate               # genera el cliente del ORM (una sola vez)
npm run dev                       # http://localhost:3001

# 3. Frontend (terminal 2)
cd client
npm install
npm run dev                       # http://localhost:5173
```

**Para probarlo:** abre `http://localhost:5173`, crea una hoja, edítala,
pliégala, usa el buscador y el filtro, elimínala. Luego, en una tercera terminal:

```bash
mariadb -u origami -porigami123 origami_db -e "SELECT id, titulo, plegada FROM hojas;"
```

…y explica: *"lo que se ve en pantalla está guardado en MySQL, no en el navegador"*.

---

## Plan A2 — Windows (en otro PC con Windows)

Windows no trae el comando `cp` y las rutas van con `\`. Para no pelear con eso,
el repositorio incluye dos scripts que se ejecutan con doble clic:

| Paso | Script | Cuándo |
| --- | --- | --- |
| 1 | `preparar-base-de-datos.bat` | Solo la **primera vez** en ese PC |
| 2 | `iniciar-windows.bat` | **Cada vez** que quieras mostrar la aplicación |

El primero importa `server\database.sql` en MySQL (te pedirá la contraseña del
usuario `root`; si no tiene, pulsa Enter). El segundo crea el `.env`, instala
las dependencias, compila la interfaz y arranca el backend, que sirve
**interfaz y API** en `http://localhost:3001`.

Si prefieres hacerlo a mano:

```bat
mysql -u root -p < server\database.sql
cd server
npm ci
npx prisma generate
copy .env.example .env
cd ..\client
npm ci
npm run build
cd ..\server
npm start
```

> **Comprueba antes en ese PC:** `node -v` y `mysql --version`. Si alguno falla,
> no pierdas tiempo ahí: usa tu portátil o el Plan B.
>
> **Ojo:** los scripts necesitan internet la primera vez, porque `npm ci`
> descarga las dependencias. Si ese PC no tiene internet, lleva la carpeta
> `node_modules` ya instalada desde tu PC.

**Si aparece `Access denied for user 'origami'`:** abre `server\.env` y, dentro
de `DATABASE_URL`, cambia `localhost` por `127.0.0.1` (el script `database.sql`
crea el usuario para los dos hosts justamente por esto).

---

## Plan B — URL pública en un minuto, sin crear cuentas ⭐

`cloudflared` (paquete oficial en CachyOS) abre un túnel desde tu PC hacia
internet y te da una URL `https://...` que cualquiera puede abrir.

**Una sola vez, para instalarlo:**

```bash
sudo pacman -S cloudflared
```

**Cada vez que quieras la URL pública:**

```bash
# 1. Compilar la interfaz (queda usando la misma URL que la API)
cd client
npm run build

# 2. Arrancar el backend: ahora sirve la interfaz Y la API en el mismo puerto
cd ../server
npx prisma generate               # solo la primera vez
npm start                         # http://localhost:3001 ya muestra la app

# 3. En OTRA terminal: abrir el túnel
cloudflared tunnel --url http://localhost:3001
```

`cloudflared` imprime algo así:

```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  https://ejemplo-verde-arbol-1234.trycloudflare.com                                        |
+--------------------------------------------------------------------------------------------+
```

Abre esa URL: verás la **misma aplicación**, y funciona desde cualquier celular.

**Truco para que salga "desde tu GitHub":** pega la URL en la ficha del repo y
quedará como enlace "sitio web" en tu perfil:

```bash
gh repo edit macaqui/origami --homepage "https://la-url-que-te-dio.trycloudflare.com"
```

**Advertencias honestas:**

- La URL es **aleatoria** y **vive solo mientras** la terminal del túnel esté
  abierta y tu PC encendido y con internet. Si cierras la terminal, muere.
- Antes de usarla, **ábrela tú mismo** y prueba crear una hoja: si funciona
  para ti, funciona para cualquiera.
- Si el Wi-Fi de la institución bloquea el túnel, el Plan A sigue funcionando.

---

## Plan C — Nube permanente (opcional)

Aquí la página ya no depende de tu PC. Necesita dos cuentas gratuitas:

### 1. Base de datos MySQL gratuita

Opciones sin tarjeta de crédito:

- **db4free.net** — MySQL 8, 200 MB. Registro con correo y confirmación.
- **Aiven** — MySQL 1 GB, plan "Free" (sin tarjeta).

Guarda el **host**, el **puerto**, el **usuario**, la **contraseña** y el
**nombre de la base**.

### 2. Importar el esquema

Entra al **phpMyAdmin** que da el proveedor, selecciona tu base y usa
**Importar → Elegir archivo → `server/database.sql` → Continuar**.

> El script termina creando el usuario `origami`, y en un hosting compartido esa
> última línea **dará error porque no tienes permisos de administrador**. Es
> normal: la tabla `hojas` y los 3 datos de ejemplo **ya se crearon antes** de
> esa línea. Ignora ese error final.

### 3. Publicar el backend (que también sirve la interfaz) en Render

1. Entra a **https://render.com** → **Get Started** → **GitHub** (no pide tarjeta).
2. **New → Web Service** → elige el repositorio **origami**.
3. Rellena exactamente esto:

| Campo | Valor |
| --- | --- |
| **Name** | `origami` |
| **Language** | `Node` |
| **Branch** | `main` |
| **Root Directory** | *(vacío)* |
| **Build Command** | `cd server && npm ci && npx prisma generate && cd ../client && npm ci && npm run build` |
| **Start Command** | `node server/src/index.js` |
| **Instance Type** | `Free` |

4. En **Environment Variables** añade:

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | `mysql://USUARIO:CLAVE@HOST:PUERTO/BASE` (todo en una línea) |
| `CORS_ORIGIN` | *(déjalo vacío: al compartir origen no hace falta)* |

5. **Create Web Service**. Render compila y te da una URL del tipo
   `https://origami-xxxx.onrender.com`. Esa URL sirve **todo**: interfaz + API.

6. Ponla como sitio web del repo:

```bash
gh repo edit macaqui/origami --homepage "https://origami-xxxx.onrender.com"
```

> **Contra del plan gratuito:** el servicio se "duerme" a los ~15 minutos sin
> uso, y la primera visita después de dormir tarda ~1 minuto en despertar.
> Si vas a mostrarlo, **ábrelo tú 2 minutos antes** para despertarlo.

---

## Si algo falla en vivo

| Síntoma | Causa probable | Solución rápida |
| --- | --- | --- |
| "No se pudieron cargar las hojas" | El backend no está corriendo | Revisa la terminal 1; `cd server && npm run dev` |
| La URL pública da 502 | El backend local se cayó | Vuelve a `npm start` en `server/` |
| La URL pública no carga nada | El túnel se cerró | Relanza `cloudflared tunnel --url http://localhost:3001` (da otra URL) |
| Error de CORS en la consola | Abriste la interfaz en `5173` pero la API está en otro sitio | Usa la URL del backend (`3001`) o el túnel: ahí comparten origen |
| `ECONNREFUSED` a MySQL | La base no está arriba | `sudo systemctl start mariadb` |
| `@prisma/client did not initialize yet` | Falta generar el cliente | `cd server && npx prisma generate` |
| Prisma: error `P2032` en `categoria` | La tabla tiene esas columnas como ENUM | Vuelve a importar `database.sql` (ya las pasa a VARCHAR) |
| `npm test` falla | No hay base de datos corriendo | Levántala: las pruebas son de **integración** |
| `cloudflared: command not found` | No lo instalaste | `sudo pacman -S cloudflared` |
| Windows: `'cp' no se reconoce como comando` | Usaste comandos de Linux | Usa `iniciar-windows.bat`, o `copy` en vez de `cp` |
| Windows: `Access denied for user 'origami'` | El host de conexión no coincide | En `server\.env`, cambia `localhost` por `127.0.0.1` dentro de `DATABASE_URL` |
| Windows: `mysql` no se reconoce | MySQL no está en el PATH | Importa la base con MySQL Workbench, o usa `C:\xampp\mysql\bin\mysql.exe` |

---

## Qué decir mientras lo muestras

> "El proyecto está separado en tres capas: React, Express y MySQL, y en el
> backend uso Prisma como ORM. Para
> desplegarlo aproveché que Express puede servir también la interfaz compilada:
> así todo queda en **un solo origen**, no hay problemas de CORS y basta una
> única URL. En desarrollo trabajo con Vite y el backend separados, y con la
> variable `VITE_API_URL` cambio a dónde apunta el frontend sin tocar el código."
