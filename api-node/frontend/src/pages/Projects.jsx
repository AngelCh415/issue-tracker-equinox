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
      <div>
        <h2 className="page-title">Proyectos</h2>
  
        {loading && (
          <p className="status-message">Cargando proyectos...</p>
        )}
        {error && (
          <p className="status-message error">{error}</p>
        )}
  
        {!loading && !error && (
          <ul className="list">
            {projects.map((p) => (
              <li key={p.id} className="list-item">
                <strong>{p.name}</strong>
                <div className="issue-meta">{p.description}</div>
              </li>
            ))}
          </ul>
        )}
  
        <p style={{ marginTop: 16 }}>
          <Link to="/issues">Ir a issues</Link>
        </p>
      </div>
    );
  }
  