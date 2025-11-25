import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

export default function Login() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post("/auth/login", { email, password });
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/projects");
        } catch (error) {
            setError("Login failed. Please check your credentials.");
            console.error("Login failed:", error);
        }
    };

    return (
      <div className="login-wrapper">
        <div className="login-card">
          <h2 className="page-title">Iniciar sesión</h2>
  
          {error && (
            <p className="status-message error">{error}</p>
          )}
  
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="label">Correo</label>
              <input
                type="email"
                className="input"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
  
            <div className="form-group">
              <label className="label">Contraseña</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
  
            <button type="submit" className="button" style={{ width: "100%" }}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }
