import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

export default function Issues() {
    const [issues, setIssues] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    //State to edit
    const [editingIssue, setEditingIssue] = useState(null);

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

    // Create issue handler
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

    // Save edits handler
    const handleUpdate = async (e) =>{
      e.preventDefault();
      try{
        setError(null);
        setSuccessMsg("");
        await apiClient.put(`/issues/${editingIssue.id}`, {
          title: editingIssue.title,
          description: editingIssue.description,
          status: editingIssue.status,
          tags: editingIssue.tags
        });
        setEditingIssue(null);
        setSuccessMsg("Issue updated successfully");
        loadIssues();
      } catch (error){
        console.error("Error updating issue:", error);
        setError("Failed to update issue"
        )
      }
    };

    // Delete issue handler
    const handleDelete = async (id) => {
      const confirmDelete = window.confirm("¿Seguro que deseas eliminar este issue?");
      if (!confirmDelete) return;
      try {
        setError(null);
        setSuccessMsg("");
        await apiClient.delete(`/issues/${id}`);
        
        if (editingIssue && editingIssue.id === id) {
          setEditingIssue(null);
        }
        
        setSuccessMsg("Issue deleted successfully");
        loadIssues();
      }catch (error) {
        console.error("Error deleting issue:", error);
        setError("Failed to delete issue");
      }
    };
    return (
      <div style={{ padding: 20 }}>
        <h2 className="page-title">Issues</h2>
  
        {/* Estados globales */}
        {loading && <p className="status-message"> Cargando issues...</p>}
        {error && <p className="status-message error">{error}</p>}
        {successMsg && <p className="status-message success">{successMsg}</p>}
  
        {/* Crear issue */}
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
  
        {/* Formulario de edición */}
        {editingIssue && (
          <div style={{ marginBottom: 30 }}>
            <h3>Editando issue #{editingIssue.id}</h3>
  
            <form onSubmit={handleUpdate}>
              <input
                value={editingIssue.title}
                onChange={(e) =>
                  setEditingIssue({ ...editingIssue, title: e.target.value })
                }
                placeholder="Título"
              />
              <br /><br />
  
              <input
                value={editingIssue.description}
                onChange={(e) =>
                  setEditingIssue({
                    ...editingIssue,
                    description: e.target.value,
                  })
                }
                placeholder="Descripción"
              />
              <br /><br />
  
              <select
                value={editingIssue.status}
                onChange={(e) =>
                  setEditingIssue({ ...editingIssue, status: e.target.value })
                }
              >
                <option value="open">Abierto</option>
                <option value="in_progress">En progreso</option>
                <option value="resolved">Resuelto</option>
              </select>
  
              <br /><br />
              <button type="submit">Guardar cambios</button>
              <button
                type="button"
                onClick={() => setEditingIssue(null)}
                style={{ marginLeft: 10 }}
              >
                Cancelar
              </button>
            </form>
          </div>
        )}
  
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
                <br />
                <button onClick={() => setEditingIssue(i)}>Editar</button>
                <button
                  onClick={() => handleDelete(i.id)}
                  style={{ marginLeft: 10 }}
                >
                  Eliminar
                </button>
                <br /><br />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }