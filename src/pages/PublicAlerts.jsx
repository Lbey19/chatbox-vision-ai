import { useEffect, useState } from "react";

export default function PublicAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState("");

  // Récupérer toutes les alertes
  useEffect(() => {
    fetch("http://localhost:4000/alerts")
      .then((res) => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

  // Fonction pour créer une alerte
  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!newAlert.trim()) return;

    // Récupérer l'utilisateur connecté (depuis localStorage)
    const storedUser = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch("http://localhost:4000/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newAlert,
          createdBy: storedUser ? storedUser.firstName : "Anonyme",
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      const created = await res.json();
      setAlerts([created, ...alerts]); // ajoute l’alerte en haut
      setNewAlert(""); // reset du champ
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="alerts-page">
      <h2 className="alerts-title">📢 Alertes</h2>

      {/* Formulaire pour créer une alerte */}
      <form onSubmit={handleCreateAlert} className="alert-form">
        <input
          type="text"
          placeholder="Écrire une alerte..."
          value={newAlert}
          onChange={(e) => setNewAlert(e.target.value)}
        />
        <button type="submit">Créer</button>
      </form>

      {alerts.length === 0 ? (
        <p className="muted">Aucune alerte pour le moment.</p>
      ) : (
        <ul className="alerts-list">
          {alerts.map((a) => (
            <li key={a.id} className="alert-item">
              <span className="alert-msg">{a.message}</span>
              <span className="alert-meta">
                — par <strong>{a.createdBy || "Anonyme"}</strong>,{" "}
                {new Date(a.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
