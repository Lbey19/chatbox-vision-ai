import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="home">
      <div className="home-card">
        <h1>Chatbox</h1>
        <p className="lead">
          Un chat Offline
        </p>
        <div className="home-actions">
          <Link to="/chat" className="btn primary">Ouvrir le chat</Link>
        </div>

      </div>
    </section>
  );
}
