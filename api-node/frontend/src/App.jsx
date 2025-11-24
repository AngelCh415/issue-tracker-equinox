import './App.css'

function App() {
  const libraries = [
    {
      category: "Routing",
      items: [
        { name: "React Router", install: "npm install react-router-dom", docs: "https://reactrouter.com/" }
      ]
    },
    {
      category: "State Management",
      items: [
        { name: "Zustand (simple)", install: "npm install zustand", docs: "https://zustand.docs.pmnd.rs/" },
        { name: "Redux Toolkit", install: "npm install @reduxjs/toolkit react-redux", docs: "https://redux-toolkit.js.org/" }
      ]
    },
    {
      category: "HTTP Client",
      items: [
        { name: "Axios", install: "npm install axios", docs: "https://axios-http.com/" },
        { name: "TanStack Query", install: "npm install @tanstack/react-query", docs: "https://tanstack.com/query/" }
      ]
    },
    {
      category: "UI Components & Styling",
      items: [
        { name: "Tailwind CSS", install: "npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p", docs: "https://tailwindcss.com/" },
        { name: "shadcn/ui (components)", install: "npx shadcn@latest init", docs: "https://ui.shadcn.com/" },
        { name: "Lucide React (icons)", install: "npm install lucide-react", docs: "https://lucide.dev/" }
      ]
    },
    {
      category: "Forms & Validation",
      items: [
        { name: "React Hook Form", install: "npm install react-hook-form", docs: "https://react-hook-form.com/" },
        { name: "Zod (validation)", install: "npm install zod", docs: "https://zod.dev/" }
      ]
    },
    {
      category: "Utilities",
      items: [
        { name: "date-fns (dates)", install: "npm install date-fns", docs: "https://date-fns.org/" },
        { name: "clsx (classnames)", install: "npm install clsx", docs: "https://github.com/lukeed/clsx" }
      ]
    }
  ];

  return (
    <div className="container">
      <header className="header">
        <h1>Issue Tracker - Frontend Starter</h1>
        <p className="subtitle">Librerías recomendadas para desarrollo rápido</p>
      </header>

      <div className="libraries">
        {libraries.map((section, idx) => (
          <div key={idx} className="library-section">
            <h2>{section.category}</h2>
            <div className="library-items">
              {section.items.map((lib, libIdx) => (
                <div key={libIdx} className="library-card">
                  <h3>{lib.name}</h3>
                  <code className="install-command">{lib.install}</code>
                  <a href={lib.docs} target="_blank" rel="noopener noreferrer" className="docs-link">
                    Ver documentación →
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        <div className="instructions">
          <h3>Estructura sugerida:</h3>
          <ul>
            <li><code>src/components/</code> - Componentes reutilizables</li>
            <li><code>src/pages/</code> - Páginas principales (Login, Projects, Issues)</li>
            <li><code>src/services/</code> - Llamadas a API</li>
            <li><code>src/hooks/</code> - Custom hooks</li>
            <li><code>src/store/</code> - Estado global (si usas Zustand/Redux)</li>
            <li><code>src/utils/</code> - Funciones auxiliares</li>
          </ul>
        </div>
      </footer>
    </div>
  )
}

export default App
