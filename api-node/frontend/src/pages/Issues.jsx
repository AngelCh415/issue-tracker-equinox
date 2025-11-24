import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

export default function Issues() {
    const [issues, setIssues] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const loadIssues = () => {
        apiClient.get("/issues")
            .then(response => {
                setIssues(response.data);
            })
            .catch(error => {
                console.error("Error fetching issues:", error);
            });
    };
    
    useEffect(() => {
        loadIssues();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post("/issues", { projectID:1, title, description });
            setTitle("");
            setDescription("");
            loadIssues();
        } catch (error) {
            console.error("Error creating issue:", error);
            alert("Failed to create issue");
        }
    };
    return (
        <div style={{ padding: 20 }}>
          <h2>Issues</h2>
    
          <form onSubmit={handleCreate}>
            <input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            /><br /><br />
            <input
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            /><br /><br />
            <button type="submit">Crear issue</button>
          </form>
    
          <hr />
    
          <h3>Listado</h3>
          <ul>
            {issues.map((i) => (
              <li key={i.id}>
                <strong>{i.title}</strong> — {i.status}
                <br />
                Tags: {i.tags?.join(", ")}
                <br /><br />
              </li>
            ))}
          </ul>
        </div>
      );
    }