import { useEffect, useState } from "react";

export default function Sidebar({ channels, onSelect, selected }) {
  const [users, setUsers] = useState([]);

  let me = null;
  try {
    const stored = localStorage.getItem("user");
    me = stored ? JSON.parse(stored) : null;
  } catch {}

  async function fetchUsers() {
    try {
      const res = await fetch("http://localhost:4000/users");
      const data = await res.json();

      const map = new Map();
      (Array.isArray(data) ? data : []).forEach((u) => {
        const key = `${u.firstName}::${u.lastName}`;
        if (!map.has(key)) map.set(key, u);
      });
      const list = Array.from(map.values());

      const filtered = me ? list.filter((u) => u.id !== me.id) : list;
      setUsers(filtered);
    } catch {
      setUsers([]);
    }
  }

  useEffect(() => {
    fetchUsers(); 
    const onFocus = () => fetchUsers();
    window.addEventListener("focus", onFocus);
    const t = setInterval(fetchUsers, 5000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(t);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sb-head">
        <h4>Salons</h4>
        <span className="muted">Local • Offline</span>
      </div>

      <ul className="channel-list">
        {channels.map((c) => (
          <li
            key={c}
            className={`channel ${selected === c ? "selected" : ""}`}
            onClick={() => onSelect(c)}
          >
            <span className="hash">#</span> {c}
          </li>
        ))}
      </ul>

      <div className="sb-head" style={{ marginTop: 20 }}>
        <h4>Utilisateurs</h4>
      </div>
      <ul className="channel-list">
        {users.map((u) => (
          <li
            key={u.id}
            className={`channel ${selected === `dm:${u.id}` ? "selected" : ""}`}
            onClick={() => onSelect(`dm:${u.id}`)}
            title={`${u.firstName} ${u.lastName}`}
          >
            <span className="hash">@</span> {u.firstName} {u.lastName}
          </li>
        ))}
        {users.length === 0 && (
          <li className="muted" style={{ padding: "6px 12px" }}>
            Aucun utilisateur pour le moment.
          </li>
        )}
      </ul>

      <div className="sb-foot">
        <button
          className="btn soft"
          onClick={() => alert("À implémenter : export des conversations")}
        >
          Exporter
        </button>
      </div>
    </aside>
  );
}
