import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";

export default function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        apiClient.get("/projects")
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error("Error fetching projects:", error);
            });
    }, []);

    return (
        <div style={{ padding: 20 }}>
          <h2>Proyectos</h2>
    
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong> — {p.description}
              </li>
            ))}
          </ul>
    
          <br />
          <Link to="/issues">Ir a issues</Link>
        </div>
      );
    }