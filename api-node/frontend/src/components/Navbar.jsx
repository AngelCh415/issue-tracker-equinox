import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const user = (() =>{
        try{
            return JSON.parse(localStorage.getItem("user"));
        } catch{
            return null;
        }
    })();
    return (
        <header className="navbar">
          <div className="navbar-title">Issue Tracker</div>
          <nav className="navbar-links">
            {user && (
              <>
                <Link to="/projects" className="navbar-link">
                  Proyectos
                </Link>
                <Link to="/issues" className="navbar-link">
                  Issues
                </Link>
                <span className="navbar-link">
                  {user.email || "Usuario demo"}
                </span>
                <button className="navbar-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>
      );
    }