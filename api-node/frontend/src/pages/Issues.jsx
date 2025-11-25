import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

export default function Issues() {
    const [issues, setIssues] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    const loadIssues = async () => {
      try{
        setLoading(true);
        setError(null);
        const res = await apiClient.get("/issues");
        setIssues(res.data);  
      } catch (err) {
        setError("Error loading issues");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
        loadIssues();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            setSuccessMsg("");
            await apiClient.post("/issues", { projectId: 1, title, description });
            setTitle("");
            setDescription("");
            setSuccessMsg("Issue created successfully");
            loadIssues();
        } catch (error) {
            console.error("Error creating issue:", error);
            setError("Failed to create issue");
        }
    };
    return (
      <div style={{ padding: 20 }}>
      <h2>Issues</h2>

      {/* Mensajes de estado */}
      {loading && <p>Cargando issues...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      {/* Formulario de creación */}
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
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

      {!loading && !error && (
        <ul>
          {issues.map((i) => (
            <li key={i.id}>
              <strong>{i.title}</strong> — {i.status}
              <br />
              {i.description}
              <br />
              Tags: {i.tags?.join(", ")}
              <br /><br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}