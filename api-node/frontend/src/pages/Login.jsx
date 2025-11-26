import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/login", { email, password });

      // Guardar usuario en localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Avisar a App para que actualice estado y se muestre Navbar
      onLogin?.(response.data.user);

      navigate("/projects");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="page-title">Login</h2>

      {error && <p className="status-message error">{error}</p>}

      <div className="form-group">
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ marginTop: 12 }}>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" style={{ marginTop: 16 }}>
        Iniciar sesión
      </button>
    </form>
  );
}
