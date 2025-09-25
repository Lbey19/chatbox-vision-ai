import { useEffect, useState } from "react";
import { FaTint } from "react-icons/fa";
import "./ModuleCommon.css";

export default function Resources() {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem("resources") || "[]")
  );
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => localStorage.setItem("resources", JSON.stringify(items)), [items]);

  function add() {
    if (!name) return;
    setItems((i) => [...i, { id: Date.now(), name, qty }]);
    setName(""); setQty(1);
  }

  function adjust(id, d) {
    setItems((arr) =>
      arr.map((it) =>
        it.id === id ? { ...it, qty: Math.max(0, it.qty + d) } : it
      )
    );
  }

  return (
    <div className="module-container">
      <div className="btn-row">
        <input placeholder="Ressource" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" min="0" value={qty} onChange={(e) => setQty(+e.target.value)} />
        <button className="btn primary" onClick={add}>
          <FaTint /> Ajouter
        </button>
      </div>

      <div className="card-grid">
        {items.map((it) => (
          <div key={it.id} className="doc-card">
            <h3>{it.name}</h3>
            <div className="progress">
              <div className="bar" style={{ width: `${it.qty * 10}%` }}></div>
            </div>
            <div className="btn-row">
              <button className="btn green" onClick={() => adjust(it.id, 1)}>+1</button>
              <button className="btn red" onClick={() => adjust(it.id, -1)}>-1</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
