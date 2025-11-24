# Issue Tracker – Prueba Técnica

Mini aplicación de gestión de incidencias (Issue Tracker) desarrollada como parte de una prueba técnica para evaluar habilidades full stack.

El objetivo es contar con:
- Un **backend principal** en Node.js + Express que gestione usuarios, proyectos e incidencias.
- Un **servicio auxiliar en Python** que clasifica issues y genera tags automáticos.
- Un **frontend en React** (en progreso) para consumir la API.

> Nota: La evaluación se centra en buenas prácticas, arquitectura y propuestas de diseño, más que en completar el 100% de los requisitos.

---

## 🧩 Stack Tecnológico

- **Backend**
  - Node.js
  - Express
  - Axios (para llamar al servicio de clasificación)
- **Servicio auxiliar**
  - Python
  - FastAPI
  - Uvicorn
- **Frontend (planeado)**
  - React + Vite
  - Tailwind CSS (o CSS simple)
- **Base de datos**
  - Actualmente, almacenamiento en memoria (arrays).
  - Interfaz preparada para migrar fácilmente a SQLite / SQL.

---

## 📁 Estructura del Proyecto

```bash
.
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── projects.routes.js
│   │   │   └── issues.routes.js
│   │   └── services/
│   │       └── classifier.service.js
│   └── package.json
│
├── classifier/
│   ├── main.py
│
├── frontend/        # (por implementar / en progreso)
│
├── README.md
├── ARCHITECTURE.md
└── GCP_PLAN.md
```

```markdown
## 🚀 Cómo ejecutar

Las instrucciones detalladas de ejecución están en:
- `backend/README.md` para el API principal.
- `classifier/README.md` para el servicio de clasificación.
- `frontend/README.md` para el cliente web (cuando esté completo).