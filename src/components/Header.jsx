import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, AlertCircle } from "lucide-react";

export default function Header() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Charger user depuis localStorage
  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener("userChanged", syncUser);
    return () => window.removeEventListener("userChanged", syncUser);
  }, []);

  const is = (p) => (loc.pathname === p ? "active" : "");

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/auth");
  }

  return (
    <header className="hdr glass">
      <div className="brand">
        <span className="logo-dot" />
        <span className="brand-name">ChatBox</span>
      </div>

      <nav className="nav">
        <Link className={is("/")} to="/">Accueil</Link>
        <Link className={is("/chat")} to="/chat">Chat</Link>
        <Link className={is("/modules")} to="/modules">Modules</Link>
        {user && (
          <Link className={is("/alerts")} to="/alerts">
            <AlertCircle size={16} style={{ marginRight: 4 }} />
            Alertes
          </Link>
        )}
      </nav>

      <div className="hdr-cta">
        {user ? (
          <div className="user-info">
            <User size={18} style={{ marginRight: 6 }} />
            <span>
              Bonjour, <strong>{user.firstName}</strong>
            </span>
            <button
              className="btn ghost"
              style={{ marginLeft: 12 }}
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <Link to="/auth" className="btn ghost">Connexion</Link>
        )}
      </div>
    </header>
  );
}
