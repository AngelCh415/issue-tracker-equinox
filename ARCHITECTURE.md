## Arquitectura de la Solución – Issue Tracker

Este documento describe las decisiones técnicas, estructura, componentes y flujo arquitectónico de la solución Issue Tracker, desarrollada como parte de una prueba técnica full-stack.

## 1. Visión General

La solución está construida como un sistema modular dividido en tres componentes principales:

Backend principal (Node.js + Express + SQLite)

Expone una API REST para proyectos e incidencias.

Calcula tags automáticos a través de un microservicio Python.

Maneja validaciones, actualizaciones, persistencia y lógica del negocio.

Servicio de clasificación (Python + FastAPI)

Microservicio independiente.

Recibe title y description de un issue y devuelve tags detectados mediante reglas simples.

Frontend (React + Vite)

Permite visualizar, crear, editar y eliminar proyectos e issues.

Consume exclusivamente al backend (el frontend nunca se comunica directamente con Python).

## 2. Diagrama Lógico (alto nivel)
```bash
[ Frontend React ]
        |
        v
[ Backend Node.js ]
        |
        +--> SQLite (persistencia)
        |
        +--> Microservicio Python (clasificación)
```

El backend actúa como orquestador entre persistencia, reglas de negocio y servicios externos.

## 3. Backend (Node.js + Express + SQLite)
## 3.1 Responsabilidades

Exponer un conjunto claro de endpoints REST:
```bash
/api/auth/login (mock)

/api/projects

/api/issues
```

Validar datos, estados y relaciones (por ejemplo, projectId debe existir).

Guardar proyectos e issues en SQLite (o modo :memory: en tests).

Integrarse con el servicio de clasificación para asignar tags.

Centralizar errores y manejar estados HTTP adecuados.

## 3.2 Estructura Interna

```bash
backend/
└── src/
    ├── index.js            # Inicializa servidor y base de datos
    ├── app.js              # Configuración de Express
    ├── db.js               # Conexión SQLite + inicialización automática
    ├── routes/
    │   ├── projects.routes.js
    │   └── issues.routes.js
    └── services/
        └── classifier.service.js
```

## 3.3 Buenas Prácticas Aplicadas

Separación clara de responsabilidades (rutas → lógica → servicios externos).

Uso de middlewares: logging (morgan), CORS, validación y manejo central de errores.

Uso de variables de entorno para URL del clasificador y puertos.

Modo de pruebas (NODE_ENV=test) sin dependencias externas, usando:

SQLite en memoria (:memory:)

Clasificador local (sin llamadas HTTP)

## 4. Servicio Auxiliar (Python + FastAPI)
## 4.1 Responsabilidades

Recibir los textos del issue.

Detectar palabras clave mediante reglas simples.

Regresar tags que el backend adjunta al registro final.

## 4.2 Reglas Actuales

Ejemplo de reglas:

```bash
"auth", "login", "token" → security

"ui", "button", "layout" → frontend

"db", "query", "sql" → database

"error", "bug", "fail" → bug

Si ninguna coincide → general
```

Fácil de extender a un modelo ML en el futuro.

# 4.3 Estructura

```bash
classifier/
└── main.py
```

# 5. Comunicación entre Servicios

El backend se comunica con Python vía HTTP POST:

```bash
POST http://localhost:8001/classify
{
  "title": "...",
  "description": "..."
}
```

En caso de caída del servicio Python:

Modo producción: fallback local basado en reglas.

Modo test: siempre se usa el clasificador local, NUNCA Axios.

Esto permite:

Tests confiables.

Backend funcional incluso si Python no está disponible.

Una arquitectura resiliente.

# 6. Persistencia de Datos (SQLite)

La base de datos se crea automáticamente al arrancar el backend con:

```bash
initDb()
```

Tablas actuales:

projects

issues (incluye tags, status, projectId)

Ventajas:

Fácil de extender a PostgreSQL / MySQL.

No requiere infraestructura adicional.

Tests aislados gracias al modo :memory:.

## 7. Frontend (React + Vite)
## 7.1 Responsabilidades

Login mock

Lista de proyectos

Lista de issues

Crear y editar issues (incluye tags generados)

Eliminar issues

Mostrar estados: loading, error, success

## 7.2 Flujo General

```bash
Frontend → Backend → (opt) Classifier → Backend → Base de datos
```

El frontend nunca accede a SQLite ni al microservicio directamente.

## 8. Futuras mejoras

Autenticación real con JWT.

Panel kanban por proyecto.

Paginación y búsqueda avanzada.

Migración del clasificador a un modelo ML.

Monitoreo de logs en Cloud Run + Logging.

Healthchecks robustos entre servicios.

## ✔ Conclusión

La arquitectura busca ser:

Modular

Escalable

Fácil de probar

Clara en responsabilidades

Robusta ante fallos del microservicio