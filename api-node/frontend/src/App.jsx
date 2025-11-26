import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Issues from "./pages/Issues";
import Navbar from "./components/Navbar";

function PrivateRoute({ children, user }) {
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="app-shell">
      <BrowserRouter>
        {/* Navbar solo si hay usuario en estado */}
        {user && <Navbar user={user} />}

        <main className="main-container">
          <div className="card">
            <Routes>
              <Route
                path="/"
                element={<Login onLogin={(loggedUser) => setUser(loggedUser)} />}
              />

              <Route
                path="/projects"
                element={
                  <PrivateRoute user={user}>
                    <Projects />
                  </PrivateRoute>
                }
              />

              <Route
                path="/issues"
                element={
                  <PrivateRoute user={user}>
                    <Issues />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </BrowserRouter>
    </div>
  );
}
