import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("signup"); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const endpoint = mode === "signup" ? "users" : "login";
      const res = await fetch(`http://localhost:4000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Réponse serveur invalide");
      }

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Ce compte existe déjà, veuillez vous connecter.");
        }
        throw new Error(data.error || "Erreur lors de la requête.");
      }

      // Sauvegarde l’utilisateur connecté
      localStorage.setItem("user", JSON.stringify(data));
      window.dispatchEvent(new Event("userChanged"));
      navigate("/chat");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="login-sub">
          {mode === "login"
            ? "Entrez vos informations pour vous connecter."
            : "Entrez vos informations pour créer un compte."}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn primary">
            {mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <div style={{ marginTop: 12 }}>
          {mode === "login" ? (
            <p>
              Pas encore de compte ?{" "}
              <button
                type="button"
                className="btn ghost"
                onClick={() => setMode("signup")}
              >
                Créer un compte
              </button>
            </p>
          ) : (
            <p>
              Déjà inscrit ?{" "}
              <button
                type="button"
                className="btn ghost"
                onClick={() => setMode("login")}
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
