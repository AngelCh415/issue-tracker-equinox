import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchProjects = async () => {
      try{
            setLoading(true);
            setError(null);
            const res = await apiClient.get("/projects");
            setProjects(res.data);  
          } catch (err) {
            setError("Error loading projects");
          } finally {
            setLoading(false);
          }
    };
      fetchProjects();
    }, []);

    return (
      <div style={{ padding: 20 }}>
        <h2>Proyectos</h2>
  
        {loading && <p>Cargando proyectos...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
  
        {!loading && !error && (
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong> — {p.description}
              </li>
            ))}
          </ul>
        )}
  
        <br />
        <Link to="/issues">Ir a issues</Link>
      </div>
    );
  }