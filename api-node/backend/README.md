# Issue Tracker API – Node.js Backend

Backend principal de la mini aplicación de gestión de incidencias (issues).  
Expone una API REST para manejar **proyectos** e **issues**, e integra un microservicio (Python/FastAPI) para clasificar issues y generar tags automáticos.

---

## 🧩 Stack

- Node.js + Express
- SQLite (archivo `issue-tracker.db`)
- Axios (llamadas al classifier en Python)
- Jest + Supertest (tests de API)

---

## 🗂 Estructura del proyecto

```bash
backend/
├── package.json
├── src/
│   ├── index.js          # Punto de entrada: levanta el servidor y llama a initDb()
│   ├── app.js            # Configuración de Express, middlewares y rutas
│   ├── db.js             # Conexión y helper de SQLite (incluye initDb)
│   ├── routes/
│   │   ├── projects.routes.js   # /api/projects
│   │   └── issues.routes.js     # /api/issues
│   └── services/
│       └── classifier.service.js  # Lógica para clasificar issues (Python + fallback)
└── tests/
    ├── app.test.js        # Tests básicos de healthcheck y rutas
    ├── projects.test.js   # Tests de API para proyectos
    └── issues.test.js     # Tests de API para issues
En entorno de test (NODE_ENV=test) la BD usa SQLite en memoria (:memory:) y el classifier se simula con reglas locales, para no depender del microservicio Python.
```

## ⚙️ Instalación
Desde la carpeta backend:

```bash
npm install
```

▶️ Ejecución

```bash
npm run dev

Por defecto levanta el API en http://localhost:3000.

```

Producción (simple)
```bash
npm start
```

🌐 Endpoints principales
```bash
GET /health
```
```bash
Devuelve estado básico del servicio:

json
{ "status": "ok", "service": "issue-tracker-api" }
GET /api/projects

Lista todos los proyectos.

POST /api/projects
Crea un nuevo proyecto:

json
{
  "name": "Nuevo proyecto",
  "description": "Descripción opcional"
}
GET /api/issues
Lista todas las issues (incluye projectId, status, tags, etc.).

POST /api/issues
Crea una issue asociada a un proyecto válido (projectId debe existir)
e integra con el servicio de clasificación para generar tags:

json
{
  "projectId": 1,
  "title": "Error al hacer login",
  "description": "El usuario no puede autenticarse..."
}
PUT /api/issues/:id
Actualiza una issue (título, descripción, estado).
Al actualizar título/descr, las tags se recalculan automáticamente en el backend.

DELETE /api/issues/:id
Elimina una issue por id.

Las respuestas de error usan el campo message, por ejemplo:
400 { "message": "projectId and title are required" }
404 { "message": "Issue not found" }
```

## 🧪 Testing
El backend usa Jest + Supertest para pruebas de integración sobre la API.

BD en tests: SQLite en memoria (:memory:).

Classifier en tests: reglas locales (no se llama al servicio Python).

Desde backend:

```bash
npm test
```

Los tests cubren, entre otros:

/health

/api/projects (creación y listado)

/api/issues (creación, validación de projectId, actualización, borrado, 404)

## 🔗 Integración con el servicio de clasificación (Python)
El backend llama al microservicio de clasificación vía HTTP:

URL configurable por CLASSIFIER_URL

Por defecto: http://localhost:8001/classify

En producción/desarrollo:

Si el servicio está disponible → usa sus tags.

Si falla → se usa un clasificador de reglas simple como fallback.

En tests (NODE_ENV=test):

No se hacen llamadas HTTP; siempre se usa el clasificador local de reglas.

## 🔧 Variables de entorno relevantes
PORT
Puerto del API (por defecto 3000).

CLASSIFIER_URL
URL del microservicio Python para clasificar issues
(por defecto http://localhost:8001/classify).

NODE_ENV

development / production: usa SQLite en archivo issue-tracker.db y el microservicio real (si está disponible).

test: usa SQLite en memoria y clasificador local (sin llamadas HTTP).

## 📌 Notas
La capa de persistencia está preparada para extenderse (nuevas tablas, relaciones, etc.).

La validación de projectId evita crear issues huérfanas.

La lógica de clasificación está desacoplada en services/classifier.service.js para poder cambiar fácilmente el modelo o el servicio externo.