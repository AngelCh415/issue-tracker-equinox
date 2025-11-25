## Issue Classifier – Microservicio en Python (FastAPI)

Microservicio responsable de clasificar issues y generar tags automáticos basados en reglas simples.
Este servicio es consumido por el backend (Node.js) vía HTTP para enriquecer cada issue creada o actualizada.

## 🧩 Stack Tecnológico

Python 3.10+

FastAPI (API REST)

Uvicorn (servidor ASGI)

Pydantic (modelos de request/response)


## 📁 Estructura del proyecto
```bash

classifier/
├── main.py          # Definición del API y endpoint /classify
└── README.md
```

## 🚀 Instalación y ejecución
1️⃣ Crear entorno virtual (opcional pero recomendado)
```bash
cd classifier
python -m venv .venv
source .venv/bin/activate      # macOS / Linux
# .venv\Scripts\activate       # Windows
```

## 2️⃣ Instalar dependencias
```bash
pip install fastapi uvicorn pydantic
```

## 3️⃣ Levantar el servidor
```bash
uvicorn main:app --reload --port 8001
```


El microservicio quedará disponible en:
```bash
http://localhost:8001
```

## 🔌 Endpoint disponible
```bash
POST /classify
```

Genera tags automáticos basados en el texto del issue.
```bash
Request
{
  "title": "Error en el login",
  "description": "El usuario no puede iniciar sesión con credenciales correctas"
}

Response
{
  "tags": ["security"]
}
```
## 🧠 Lógica de clasificación

El sistema funciona con reglas simples:

Palabras clave detectadas	Tag asignado

```bash
"auth", "login", "token"	security
"ui", "button", "layout", "frontend"	frontend
"db", "query", "sql", "database"	database
"error", "fail", "bug"	bug
Ninguna coincidencia	general
```

Esta arquitectura permite escalar fácilmente a un modelo de ML en el futuro sin cambiar la interfaz del servicio.

## 🛡 Fallback en el backend (Node.js)

El backend está diseñado para:

Consultar este microservicio cuando está disponible.

Usar reglas locales cuando:

El microservicio está apagado

Hay errores de red

El entorno es NODE_ENV=test

Esto garantiza que el proyecto funcione incluso si el clasificador externo falla.

## 🧪 Testing

El microservicio puede probarse con:
```bash
curl -X POST http://localhost:8001/classify \
 -H "Content-Type: application/json" \
 -d '{"title":"login error","description":"fails with token"}'


Salida esperada:

{ "tags": ["security", "bug"] }
```

## 📌 Notas finales

El servicio es independiente y se puede desplegar en Cloud Run, Docker o como contenedor local.

Es liviano, rápido y perfecto para integrarse con pipelines futuros.

La interfaz es estable, por lo que cambiar el motor de clasificación no rompe el backend ni el frontend.