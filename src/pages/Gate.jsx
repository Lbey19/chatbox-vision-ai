import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Gate() {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const GLOBAL_PASSWORD = "12345";

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (pwd === GLOBAL_PASSWORD) {
      // marque la session comme autorisée 
      sessionStorage.setItem("site_gate_passed", "1");
      // retourne à la page d'accueil 
      navigate("/chat", { replace: true });
    } else {
      setError("Mot de passe incorrect.");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      background: "linear-gradient(180deg, #fff7f1, #fdeee6)"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 460,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 16,
        padding: 28,
        boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
      }}>
        <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Accès restreint</h2>
        <p style={{ color: "#6b5a50", marginTop: 8 }}>
          Entrez le mot de passe pour accéder au site.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 14, display: "grid", gap: 12 }}>
          <label style={{ fontWeight: 700, color: "#6b5a50" }}>Mot de passe</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Entrez le mot de passe"
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.08)",
              outline: "none",
              fontSize: "1rem",
            }}
            autoFocus
          />

          {error && <div style={{ color: "#ef4444", fontWeight: 700 }}>{error}</div>}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => {
                setPwd("");
                setError("");
              }}
              className="btn ghost"
            >
              Effacer
            </button>
            <button type="submit" className="btn primary">
              Entrer
            </button>
          </div>

          <p style={{ marginTop: 8, color: "#8b6f63", fontSize: "0.9rem" }}>
            Interdiction de divulguer le mot de passe, ultron pourrait le retrouver.
          </p>
        </form>
      </div>
    </div>
  );
}
