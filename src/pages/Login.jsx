import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adminId, password }),
      });

      const data = await res.json();
      if (data.success) {
        navigate("/admin"); 
      } else {
        setError("Identifiant ou mot de passe incorrect !");
      }
    } catch (err) {
      setError("Erreur serveur, réessayez plus tard.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Connexion Admin</h2>
        <p className="login-sub">Accès réservé à l’administrateur.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Identifiant</label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Entrez votre identifiant"
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn primary">Se connecter</button>
        </form>
      </div>
    </div>
  );
}
