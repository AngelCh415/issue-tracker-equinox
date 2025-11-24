# Arquitectura de la solución – Issue Tracker

Este documento describe las decisiones técnicas y la arquitectura utilizada en la mini aplicación de gestión de incidencias (Issue Tracker) desarrollada para la prueba técnica.

---

## 1. Visión general

La solución está pensada como una aplicación **full stack** compuesta por tres módulos:

1. **Backend principal (Node.js + Express)**  
   - Expone una API REST para:
     - Login mock.
     - Gestión de proyectos.
     - Gestión de issues.
   - Integra con un servicio auxiliar en Python para clasificar issues y generar tags automáticos.

2. **Servicio auxiliar de clasificación (Python + FastAPI)**  
   - Microservicio independiente.
   - Expone un endpoint `/classify` que recibe `title` y `description` y devuelve una lista de tags basada en reglas simples.

3. **Frontend (React + Vite)** *(en progreso)*  
   - Consumirá la API del backend para:
     - Mostrar proyectos.
     - Listar issues.
     - Crear/editar issues mostrando los tags sugeridos.

---

## 2. Diagrama lógico (alto nivel)

```text
[Frontend React]  -->  [Backend Node/Express]  -->  [Python Classifier]
        |                        |
        |                        -->  [Almacenamiento en memoria (issues, projects)]
        |
        --> Peticiones HTTP a /api/*
```
## 3. Backend principal (Node.js + Express)
## 3.1 Responsabilidades

Manejar un flujo de autenticación mock (login) que devuelve un usuario de prueba y un token ficticio.

Gestionar entidades de dominio:

Proyectos.

Issues.

Coordinar la integración con el microservicio de clasificación antes de guardar un issue.

Exponer endpoints REST claros y simples.

## 3.2 Estructura interna
backend/
└── src/
    ├── index.js          # Punto de entrada, arranca el servidor HTTP
    ├── app.js            # Configuración de Express, middlewares y registro de rutas
    ├── routes/           # Definición de endpoints públicos
    │   ├── auth.routes.js
    │   ├── projects.routes.js
    │   └── issues.routes.js
    └── services/         # Lógica de integración externa / servicios de dominio
        └── classifier.service.js

## 3.3 Patrones y buenas prácticas

Separación de responsabilidades:

Las rutas se encargan sólo de recibir la request, delegar a servicios y devolver la respuesta.

La lógica de integración con el servicio Python se concentra en classifier.service.js.

Uso de middlewares:

morgan para logging de requests.

cors para permitir consumo desde el frontend.

Middleware de manejo de errores para centralizar respuestas 500/4xx.

Configuración:

Uso de variables de entorno (vía dotenv previsto) para puertos y URLs externas.

## 4. Servicio auxiliar (Python + FastAPI)
## 4.1 Responsabilidades

Recibir el texto del issue (title + description).

Aplicar reglas sencillas basadas en palabras clave para asignar tags.

Responder en formato JSON a las peticiones del backend.

## 4.2 Ejemplo de reglas

Si el texto contiene auth, login, token → tag "security".

Si contiene ui, button, layout → tag "frontend".

Si contiene db, query, sql → tag "database".

Si no hay coincidencias → tag "general".

## 4.3 Estructura
classifier/
└── main.py    # Definición del API de FastAPI y endpoint /classify


El servicio es intencionalmente simple, pero desacoplado del backend, lo que permite evolucionarlo a un modelo de ML real sin cambiar la interfaz.

## 5. Comunicación entre servicios

La comunicación entre el backend y el servicio de clasificación es vía HTTP usando JSON.

Flujo al crear un issue:

El cliente (Postman o frontend) envía un POST /api/issues al backend.

El backend extrae title y description.

El backend llama al microservicio Python:

POST http://localhost:8001/classify


El servicio Python devuelve algo como:

{ "tags": ["security"] }


El backend agrega esos tags al issue creado y lo devuelve en la respuesta.

Este patrón de orquestación mantiene a Node como punto central y deja la clasificación como responsabilidad de un servicio especializado.

## 6. Persistencia de datos

En esta versión de la prueba:

La información de proyectos e issues se almacena en memoria (arrays en el backend).

El código está estructurado de tal forma que la capa de almacenamiento pueda sustituirse por:

SQLite,

PostgreSQL,

u otra base de datos relacional.

Motivo de diseño:

El foco de la prueba es mostrar:

Arquitectura limpia.

Separación de responsabilidades.

Integración entre servicios.

La persistencia se puede extender fácilmente añadiendo una capa de models/ o repositories/ sin tocar la API pública.

## 7. Frontend (planificado)

Aunque el frontend está en progreso, la arquitectura está pensada para incluir:

Pantalla de login mock (consume /api/auth/login).

Pantalla de lista de proyectos (consume /api/projects).

Pantalla de issues:

Vista en tabla o columnas tipo kanban.

Formulario de creación/edición que despliega los tags sugeridos.

La comunicación se realizará vía fetch/axios hacia el backend, manteniendo al frontend completamente desacoplado del microservicio Python.

## 8. Futuras mejoras

Sustituir el almacenamiento en memoria por SQLite o PostgreSQL.

Añadir autenticación real con JWT y persistencia de usuarios.

Extender el microservicio de clasificación a un modelo de ML.

Añadir tests unitarios e integración para backend y servicio Python.

Dockerizar cada servicio y agregar docker-compose.yml para levantar todo el entorno con un solo comando.