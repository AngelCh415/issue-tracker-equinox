import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

export default function Issues() {
    const [issues, setIssues] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
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
 
    const loadProjects = async () => {
      try{
        const res = await apiClient.get("/projects");
        setProjects(res.data);  
        if (res.data.length && !selectedProjectId) {
          setSelectedProjectId(res.data[0].id);
        }
      } catch (err) {
        setError("Error loading projects");
        console.error(err);
      }
    };
    useEffect(() => {
        loadProjects();
        loadIssues();
    }, []);
    const getProjectName = (projectId) => {
      const project = projects.find((p) => p.id === projectId);
      return project ? project.name : "Unknown Project";
    };
    // Create issue handler
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            setSuccessMsg("");
            if (!selectedProjectId) {
              setError("Please select a project");
              return;
            }
            await apiClient.post("/issues", {
                projectId: Number(selectedProjectId),
                title,
                description,
            });
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
      <div>
        <h2 className="page-title">Issues</h2>
  
        {/* Estados globales */}
        {loading && <p className="status-message">Cargando issues...</p>}
        {error && <p className="status-message error">{error}</p>}
        {successMsg && (
          <p className="status-message success">{successMsg}</p>
        )}
  
        {/* Crear issue */}
        <form onSubmit={handleCreate} className="form" style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label className="label" htmlFor="proyectSelect">Proyecto</label>
            <select
              id="proyectSelect"
              className="select"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="">Selecciona un proyecto</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
  
          <div className="form-group">
            <label className="label">Título</label>
            <input
              className="input"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
  
          <div className="form-group">
            <label className="label">Descripción</label>
            <input
              className="input"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
  
          <button type="submit" className="button-primary">
            Crear issue
          </button>
        </form>
  
        <hr />
  
        {/* Formulario de edición */}
        {editingIssue && (
          <div style={{ marginBottom: 30 }}>
            <h3 className="section-title">
              Editando issue #{editingIssue.id}
            </h3>
  
            <form onSubmit={handleUpdate} className="form">
              <div className="form-group">
                <label className="label">Título</label>
                <input
                  className="input"
                  value={editingIssue.title}
                  onChange={(e) =>
                    setEditingIssue({
                      ...editingIssue,
                      title: e.target.value,
                    })
                  }
                  placeholder="Título"
                />
              </div>
  
              <div className="form-group">
                <label className="label">Descripción</label>
                <input
                  className="input"
                  value={editingIssue.description}
                  onChange={(e) =>
                    setEditingIssue({
                      ...editingIssue,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descripción"
                />
              </div>
  
              <div className="form-group">
                <label className="label">Estado</label>
                <select
                  className="select"
                  value={editingIssue.status}
                  onChange={(e) =>
                    setEditingIssue({
                      ...editingIssue,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="open">Abierto</option>
                  <option value="in_progress">En progreso</option>
                  <option value="resolved">Resuelto</option>
                </select>
              </div>
  
              <button type="submit" className="button-primary">
                Guardar cambios
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setEditingIssue(null)}
              >
                Cancelar
              </button>
            </form>
          </div>
        )}
  
        <h3 className="section-title">Listado</h3>
  
        {!loading && !error && (
          <ul className="list">
            {issues.map((i) => (
              <li key={i.id} className="list-item">
                <strong>{i.title}</strong> — {i.status}
                <div className="issue-meta">
                  Proyecto: {getProjectName(i.projectId)}
                </div>
                <div className="issue-meta">{i.description}</div>
                <div className="issue-meta">
                  Tags: {i.tags?.join(", ") || "–"}
                </div>
                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => setEditingIssue(i)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => handleDelete(i.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }