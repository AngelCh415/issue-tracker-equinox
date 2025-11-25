import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Issues from "./pages/Issues";
import Navbar from "./components/Navbar";

function PrivateRoute ({ children }) {
  const user = localStorage.getItem("user");
  if(!user){
    return <Navigate to="/" replace/>;
  }
  return children;
}

function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        {/* Navbar sólo si hay usuario */}
        {localStorage.getItem("user") && <Navbar />}

        <main className="main-container">
          <div className="card">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/projects"
                element={
                  <PrivateRoute>
                    <Projects />
                  </PrivateRoute>
                }
              />
              <Route
                path="/issues"
                element={
                  <PrivateRoute>
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

export default App;