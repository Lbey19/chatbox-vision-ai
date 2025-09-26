import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import InputBox from "./InputBox";

export default function ChatWindow({ channel, me, dmUser }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);
  const confettiRef = useRef(null);

  // Charger les messages
  useEffect(() => {
    const loadMessages = () => {
      fetch(`http://localhost:4000/messages/${channel}`)
        .then((res) => res.json())
        .then((data) => setMessages(Array.isArray(data) ? data : []))
        .catch(() => setMessages([]));
    };

    loadMessages();
    
    // Polling pour les nouveaux messages (utile pour les réponses de Vision)
    const interval = setInterval(loadMessages, 2000);
    
    return () => clearInterval(interval);
  }, [channel]);

  // Scroll automatique 
  function scrollToBottom() {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }

  // Effet confetti
  function burst() {
    const cvs = confettiRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const w = (cvs.width = cvs.clientWidth);
    const h = (cvs.height = cvs.clientHeight);
    const parts = Array.from({ length: 28 }, () => ({
      x: w - 120,
      y: h - 60,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 5 - 2,
      g: 0.18,
      r: Math.random() * 3 + 2,
      hue: [18, 28, 168, 145][(Math.random() * 4) | 0],
      life: (70 + Math.random() * 20) | 0,
    }));

    let raf;
    function step() {
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.g;
        p.life--;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, 55%, ${Math.max(0, p.life / 90)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (parts.some((p) => p.life > 0)) raf = requestAnimationFrame(step);
      else ctx.clearRect(0, 0, w, h);
    }
    step();
    return () => cancelAnimationFrame(raf);
  }

  // Envoyer un message
  async function send({ text, file }) {
    let fileUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("http://localhost:4000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        fileUrl = data.url;
      } catch (err) {
        console.error("Erreur upload fichier:", err);
      }
    }

    const newMessage = {
      author: me.firstName,
      content: text || "",
      fileUrl,
      recipient: dmUser ? (dmUser.firstName === "Vision" ? "Vision" : `${dmUser.firstName} ${dmUser.lastName}`) : null,
    };

    fetch(`http://localhost:4000/messages/${channel}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    })
      .then((res) => res.json())
      .then((saved) => {
        setMessages((prev) => [...prev, saved]);
        scrollToBottom(); 
      })
      .catch((err) => console.error("Erreur envoi message:", err));
  }

  // Vider le salon
  function clearAll() {
    fetch(`http://localhost:4000/messages/${channel}`, { method: "DELETE" })
      .then(() => setMessages([]))
      .catch(() => setMessages([]));
  }

  return (
    <section className="chat">
      <div className="chat-top">
        <div>
          {dmUser ? (
            <>
              <h3>💬 {dmUser.firstName} {dmUser.lastName}</h3>
              <p className="muted">Discussion privée</p>
            </>
          ) : (
            <>
              <h3>#{channel}</h3>
              <p className="muted">Salon connecté à l’API backend</p>
            </>
          )}
        </div>
        <div className="head-actions">
          <button className="btn soft" onClick={clearAll}>Vider</button>
        </div>
      </div>

      <div className="chat-body" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="empty">Commence la conversation 🚀</div>
        )}
        {messages.map((m) => {
          let sources = null;
          if (m.sources) {
            try {
              sources = JSON.parse(m.sources);
            } catch (e) {
              sources = null;
            }
          }
          return (
            <Message
              key={m.id}
              data={{ ...m, text: m.content, sources }}
              mine={m.author === me.firstName}
            />
          );
        })}
        <canvas className="confetti-layer" ref={confettiRef} />
      </div>

      <InputBox onSend={send} onClear={clearAll} onBurst={burst} />
    </section>
  );
}
