# Issue Tracker – Frontend (React + Vite)

Frontend de la aplicación **Issue Tracker**, encargado de mostrar proyectos, crear issues, editarlas, eliminarlas e integrar los tags generados por el microservicio de clasificación.

Este módulo consume el backend en Node.js y muestra una interfaz simple pero ordenada para interactuar con los datos.

---

## 🧩 Stack

- **React + Vite**
- **React Router DOM** (navegación entre Login, Projects e Issues)
- **Axios** para consumir la API
- **CSS base** (Vite default) con estilos adicionales ligeros
- **Jest + React Testing Library + Vitest** para tests unitarios

---

## ▶️ Instalación

Desde la carpeta `frontend`:

```bash
npm install
```

## ▶️ Ejecución
```bash
npm run dev
```

La aplicación estará disponible en:

```bash
http://localhost:5173
```

Construcción para producción
```bash
npm run build
```
## 🌐 Comunicación con API

Este frontend consume el backend Node.js:

```bash
http://localhost:3000/api
```


El archivo:
```bash
src/services/apiClient.js
```

Centraliza la URL base y las peticiones Axios.

## 🧭 Páginas implementadas
## ✔ Login (mock)

Simulación simple de login.

Redirección inmediata a Projects.

### ✔ Projects List

Consulta y visualiza proyectos desde /api/projects.

Botón para ir a Issues del proyecto.

Manejo de estados: loading, error.

### ✔ Issues List

Lista issues de /api/issues.

Botón para editar cada issue.

Cada issue muestra:

título

descripción

estado

tags generados por el classifier

Estilos simples tipo tarjeta/lista.

### ✔ Crear Issue

Formulario que permite:

seleccionar proyecto (select dinámico desde /api/projects)

escribir título y descripción

enviar al backend y luego refrescar datos

Valida:

Debe seleccionar un proyecto antes de crear

### ✔ Editar Issue

Incluye:

título

descripción

estado (open, in_progress, resolved)

tags se recalculan automáticamente en backend

### ✔ Eliminar Issue

Confirmación antes de eliminar

Refresca la lista tras eliminar

🎨 Estilos

Se utiliza la hoja de estilos base que viene con Vite:

src/index.css


Y se agregaron clases utilitarias propias:

.page-title

.status-message, .status-message.error, .status-message.success

.card

.list-container

.issue-item

.btn, .btn-danger, .btn-secondary

El estilo se mantiene simple, limpio y responsivo.

## 🧪 Testing

El frontend cuenta con pruebas unitarias usando:

Vitest

React Testing Library

Jest-DOM

Ejecutar pruebas:

npm test


Se mockea Axios para evitar dependencias con el backend real.
Pruebas incluidas:

Renderizado de Issues

Creación de issue

Edición

Lectura de proyectos

Validación de selects

Manejo de estados

## 📁 Estructura del proyecto
```bash
src/
├── App.jsx                # Rutas principales
├── index.jsx              # Punto de entrada
├── pages/
│   ├── Login.jsx
│   ├── Projects.jsx
│   └── Issues.jsx
├── services/
│   └── apiClient.js       # Axios configurado
├── components/            # (opcional futuro)
└── tests/                 # Pruebas unitarias
```

## 🔧 Variables de entorno

Puedes configurar la URL del backend creando un archivo .env:

VITE_API_URL=http://localhost:3000/api


En apiClient.js:

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

## 📝 Notas finales

El frontend está diseñado para ser simple, entendible y funcional.

Todos los endpoints están desacoplados para facilitar cambios posteriores.

Puedes extenderlo rápidamente a una UI más completa con Tailwind o Material UI.

El flujo completo Projects → Issues → CRUD + Tags está cubierto.