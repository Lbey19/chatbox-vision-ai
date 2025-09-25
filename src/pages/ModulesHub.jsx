
import { useState, useEffect } from "react";
import { Book, HelpCircle, Bell, AlertTriangle } from "lucide-react";

export default function ModulesHub() {
  const [alerts, setAlerts] = useState([]);

  // Charger les alertes depuis le backend
  useEffect(() => {
    fetch("http://localhost:4000/alerts")
      .then((res) => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

  const modules = [
    {
      id: "docs",
      title: "Documentation",
      desc: "Guides complets de survie et astuces pratiques",
      icon: <Book size={36} strokeWidth={2.2} />,
      link: "/modules/docs",
      color: "var(--coral)",
    },
    {
      id: "quiz",
      title: "Quiz",
      desc: "Teste tes connaissances sur la survie",
      icon: <HelpCircle size={36} strokeWidth={2.2} />,
      link: "/modules/quiz",
      color: "var(--sky)",
    },
  ];

  return (
    <div className="modules-page module-container">
      <h1 className="modules-title">Centre des Modules</h1>

      <div className="modules-grid">
        {modules.map((m) => (
          <a key={m.id} href={m.link} className="module-card fancy">
            <div className="module-icon-wrapper" style={{ background: m.color }}>
              {m.icon}
            </div>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
          </a>
        ))}
      </div>

      <div className="alerts-section">
        <div className="alerts-header">
          <Bell size={26} />
          <h2 className="alerts-title">Alertes en cours</h2>
        </div>

        <div className="alerts-grid">
          {alerts.length === 0 ? (
            <p className="muted">Aucune alerte pour le moment.</p>
          ) : (
            alerts.map((a) => (
              <div key={a.id} className="alert-card critical">
                <AlertTriangle size={22} className="alert-icon danger" />
                <div>
                  <p className="alert-msg">{a.message}</p>
                  <span className="alert-date">
                    {a.createdBy ? `par ${a.createdBy} — ` : ""}
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
