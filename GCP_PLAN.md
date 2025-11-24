
---
# Plan de despliegue en GCP – Issue Tracker

Este documento describe un plan teórico de despliegue de la aplicación Issue Tracker en Google Cloud Platform (GCP), contemplando backend, microservicio de clasificación y frontend.

---

## 1. Objetivo

Desplegar la solución de forma que:

- Sea **escalable** (según carga).
- Use servicios **gestionados** de GCP.
- Permita evolucionar la arquitectura (por ejemplo, migrar a base de datos SQL) sin cambios drásticos.

---

## 2. Componentes principales en GCP

1. **Cloud Run**
   - Backend Node.js.
   - Microservicio Python de clasificación.
   - (Opcional) Frontend si se sirve como app Node o Express.

2. **Cloud SQL (PostgreSQL / MySQL) – Fase futura**
   - Reemplazar almacenamiento en memoria por base de datos relacional.
   - Persistencia de usuarios, proyectos, issues.

3. **Artifact Registry**
   - Almacenamiento de imágenes Docker para backend, classifier y eventualmente frontend.

4. **Cloud Build / GitHub Actions**
   - Pipelines de CI/CD para build + test + deploy.

5. **Cloud Logging & Cloud Monitoring**
   - Centralización de logs.
   - Dashboards básicos de métricas (requests, errores, latencia).

---

## 3. Despliegue del backend (Node.js + Express)

### 3.1 Empaquetado

1. Crear un `Dockerfile` para el backend, por ejemplo:

   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm install --only=production

   COPY . .

   ENV PORT=8080
   EXPOSE 8080

   CMD ["node", "src/index.js"]
2. Construir y subir la imagen a Artifact Registry:

gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT_ID/issue-tracker/backend

## 3.2 Despliegue en Cloud Run
gcloud run deploy issue-tracker-backend \
  --image=REGION-docker.pkg.dev/PROJECT_ID/issue-tracker/backend \
  --platform=managed \
  --region=REGION \
  --allow-unauthenticated \
  --set-env-vars=CLASSIFIER_URL=https://issue-tracker-classifier-<hash>-uc.a.run.app


CLASSIFIER_URL se usará en el backend para llamar al microservicio Python.

A futuro se podrían añadir:

Variables de entorno para credenciales de Cloud SQL.

Configuración de CORS para el dominio del frontend.

## 4. Despliegue del microservicio de clasificación (Python + FastAPI)
## 4.1 Empaquetado

Dockerfile de ejemplo:

FROM python:3.10-slim

WORKDIR /app

COPY . .
RUN pip install fastapi uvicorn pydantic

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

## 4.2 Despliegue en Cloud Run
gcloud run deploy issue-tracker-classifier \
  --image=REGION-docker.pkg.dev/PROJECT_ID/issue-tracker/classifier \
  --platform=managed \
  --region=REGION \
  --allow-unauthenticated


En un entorno más restringido, se podría limitar el acceso a este servicio para que sólo el backend pueda consumirlo (mediante IAM o VPC).

## 5. Frontend (React + Vite)

Hay dos alternativas principales:

Cloud Run

Servir el frontend con un servidor Node/Express o un servidor estático simple.

Integración sencilla si se desea tener una sola URL.

Cloud Storage + Cloud CDN

Compilar el proyecto (npm run build).

Subir los archivos estáticos (dist/) a un bucket público.

Colocar Cloud CDN delante para mejor rendimiento.

Para una primera versión, Cloud Storage + Cloud CDN suele ser suficiente y económico.

## 6. Base de datos (evolución futura)

Aunque la prueba actual utiliza almacenamiento en memoria, el siguiente paso natural sería:

Crear una instancia de Cloud SQL (PostgreSQL).

Definir una capa de acceso a datos en el backend (models/repositories).

Configurar el backend con variables de entorno:

DB_HOST

DB_USER

DB_PASSWORD

DB_NAME

Conectando vía:

pg (driver puro) o

un ORM como Prisma / Sequelize / TypeORM.

## 7. CI/CD
## 7.1 Fuente

Repositorio en GitHub con:

/backend

/classifier

/frontend

## 7.2 Pipeline

Opciones:

Cloud Build triggers conectados a GitHub.

O GitHub Actions que usen gcloud para desplegar.

Flujo sugerido:

git push a rama main o una rama específica.

Build de imágenes Docker para backend y classifier.

Ejecución de tests (cuando existan).

Deploy a Cloud Run de:

issue-tracker-backend

issue-tracker-classifier

issue-tracker-frontend (si aplica).

## 8. Monitoreo y observabilidad

Cloud Run se integra automáticamente con Cloud Logging:

Logs de requests.

Logs de errores.

Se recomienda:

Crear dashboards en Cloud Monitoring para:

Latencia promedio.

Cantidad de requests.

Errores 4xx / 5xx.

Configurar alertas básicas (por ejemplo, si el error rate supera cierto umbral).

## 9. Resumen

La solución está diseñada para:

Ser modular (backend y classifier se escalan de forma independiente).

Ser portable (todo se empaqueta como contenedores).

Permitir una evolución natural:

De reglas simples a modelos de clasificación más complejos.

De almacenamiento en memoria a Cloud SQL.

De un entorno de prueba local a un entorno gestionado en GCP con CI/CD.