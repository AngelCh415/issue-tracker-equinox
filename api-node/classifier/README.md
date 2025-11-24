# Servicio de Clasificación de Issues (Classifier)

Este servicio está desarrollado en **Python + FastAPI** y se encarga de generar etiquetas (tags) automáticas para los issues, a partir del título y la descripción.

Se expone como un microservicio independiente que el backend (Node.js) consume vía HTTP.

---

## 🧩 Stack

- Python 3.10+
- FastAPI
- Uvicorn
- Pydantic

---

## 📁 Estructura

```bash
classifier/
├── main.py          # Definición del API y endpoint /classify
└── README.md
```

## 🚀 Puesta en marcha

Crear y activar entorno virtual (opcional pero recomendado):

```bash
cd classifier
python -m venv .venv
source .venv/bin/activate   # En macOS / Linux
# .venv\Scripts\activate    # En Windows
```

Instalar dependencias:

```bash
pip install fastapi uvicorn pydantic
```

Levantar el servicio:

```bash
uvicorn main:app --reload --port 8001
```

El servicio quedará escuchando en:

```bash
http://localhost:8001
```

🔌 Endpoint disponible
```bash
POST /classify

Request body (JSON):

{
  "title": "Error en el login",
  "description": "El usuario no puede iniciar sesión con credenciales correctas"
}


Response (JSON):

{
  "tags": ["security"]
}
```

🧠 Lógica de clasificación (reglas básicas)

Las tags se generan en base a palabras clave simples:

Si el texto contiene auth, login, token → "security".

Si el texto contiene ui, button, layout → "frontend".

Si el texto contiene db, query, sql → "database".

Si no hay coincidencias → "general".

Estas reglas pueden escalarse en el futuro a un modelo de ML sin cambiar la interfaz del servicio.