## Plan de despliegue en GCP – Issue Tracker


Este documento describe un plan teórico de despliegue de la aplicación Issue Tracker en Google Cloud Platform (GCP), considerando backend, microservicio de clasificación y frontend.

## 1. Objetivo

Desplegar la solución de forma que:

Sea escalable (cada componente puede crecer de forma independiente).

Aproveche servicios gestionados de GCP sin administrar servidores.

Permita evolucionar el sistema sin reescribir arquitectura.

## 2. Componentes principales en GCP
## 2.1. Cloud Run

Se usaría para ejecutar contenedores de:

Backend Node.js

Microservicio de clasificación en Python

Frontend (opcional si se sirve via Node o servidor estático)

Cloud Run entrega:

Autoscaling

HTTPS automático

Despliegue sencillo desde Artifact Registry

Integración nativa con IAM y Cloud Monitoring

## 2.2. Cloud SQL (PostgreSQL o MySQL) — Evolución futura

Actualmente el backend usa SQLite, pero en producción se reemplazaría por:

Cloud SQL PostgreSQL

Cloud SQL MySQL

Beneficios:

Conexiones seguras

Backups automáticos

Fácil escalamiento

## 2.3. Artifact Registry

Almacena imágenes Docker:

```bash
api-node/backend
api-node/classifier
api-node/frontend
```

## 2.4. Cloud Build o GitHub Actions

Pipeline CI/CD:

Build

Tests

Push a Artifact Registry

Deploy automático a Cloud Run

## 2.5. Cloud Logging & Cloud Monitoring

Para métricas esenciales:

Requests/seg

Latencia

Errores 4xx/5xx

Alertas de disponibilidad

## 3. Backend (Node.js + Express + SQLite)
## 3.1 Empaquetado en Docker
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["node", "src/index.js"]

## 3.2 Subir a Artifact Registry
gcloud builds submit \
  --tag REGION-docker.pkg.dev/PROJECT_ID/issue-tracker/backend

## 3.3 Desplegar en Cloud Run
gcloud run deploy issue-tracker-backend \
  --image=REGION-docker.pkg.dev/PROJECT_ID/issue-tracker/backend \
  --platform=managed \
  --region=REGION \
  --allow-unauthenticated \
  --set-env-vars=CLASSIFIER_URL=https://issue-tracker-classifier-<hash>-uc.a.run.app

## 🔹 Consideraciones adicionales

Migración de SQLite → Cloud SQL en ambiente productivo.

Configuración de:

DB_HOST

DB_USER

DB_PASSWORD

DB_NAME

CORS para permitir acceso desde el frontend.

## 4. Microservicio de Clasificación (Python + FastAPI)
## 4.1 Dockerfile

```bash
FROM python:3.10-slim

WORKDIR /app

COPY . .
RUN pip install fastapi uvicorn pydantic

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

## 4.2 Deploy en Cloud Run

```bash
gcloud run deploy issue-tracker-classifier \
  --image=REGION-docker.pkg.dev/PROJECT_ID/issue-tracker/classifier \
  --platform=managed \
  --region=REGION \
  --allow-unauthenticated
  ```

## 🔹 Seguridad recomendada

Limitar acceso para que solo Cloud Run del backend pueda llamar al microservicio.

Usar IAM o VPC Serverless Connector.

## 🔹 Resiliencia

Si el clasificador falla, el backend ya implementa un fallback local de reglas.
Esto permite resiliencia incluso sin disponibilidad total del microservicio.

## 5. Frontend (React + Vite)

Dos opciones de despliegue:

Opción A — Cloud Run

Construir artefacto (npm run build)

Servir con Node o un servidor estático

Beneficio:
Una sola URL, sencillo de conectar a API Gateway o Cloud Run.

Opción B — Cloud Storage + Cloud CDN (recomendado)

Build del proyecto

Subida de dist/ a un bucket estático

Activar Cloud CDN para mejor latencia

Es más económico y eficiente para frontends SPA.

## 6. Base de Datos (Presente y Futuro)
Presente

El backend usa SQLite, que se crea automáticamente con initDb().

Futuro en GCP

Usar Cloud SQL PostgreSQL:

pg o Prisma como ORM

Conexiones privadas mediante Cloud SQL Proxy

Variables de entorno seguras mediante Secret Manager

## 7. CI/CD en GCP
## 7.1 Repositorio con estructura:
```bash
api-node/backend
api-node/classifier
api-node/frontend
```

## 7.2 Pipeline recomendado
Opción A — Cloud Build Triggers

Cada push a main:

Build de backend → push a Artifact Registry

Build de classifier → push a Artifact Registry

Build frontend → bucket de Cloud Storage

Tests automáticos

Deploy a Cloud Run

Opción B — GitHub Actions

Usar gcloud CLI dentro de workflows.

## 8. Observabilidad

Cloud Logging → registros de backend y classifier

Cloud Monitoring:

latencia promedio

requests/seg

errores

Alertas:

error rate > 5%

latencia > 500ms

healthcheck inactivo

## 9. Resumen

La arquitectura está diseñada para ser:

Modular: backend y classifier se escalan individualmente.

Portable: cada componente es un contenedor.

Resiliente: fallback del clasificador asegura disponibilidad.

Escalable: Cloud Run + Cloud SQL.

Evolutiva: se puede migrar de reglas simples a ML sin alterar contratos API.