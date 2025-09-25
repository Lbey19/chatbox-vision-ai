import { useEffect, useState } from "react";

// Icônes SVG inline pour chaque section
const icons = {
  intro: (
    <svg width="20" height="20" fill="currentColor"><path d="M10 0L12 6H18L13 9L15 15L10 11L5 15L7 9L2 6H8L10 0Z"/></svg>
  ),
  eau: (
    <svg width="20" height="20" fill="currentColor"><path d="M10 0C4 8 2 12 2 15A8 8 0 0018 15C18 12 16 8 10 0Z"/></svg>
  ),
  nourriture: (
    <svg width="20" height="20" fill="currentColor"><path d="M3 3h14v2H3V3Zm0 6h14v2H3V9Zm0 6h14v2H3v-2Z"/></svg>
  ),
  abri: (
    <svg width="20" height="20" fill="currentColor"><path d="M2 10L10 2L18 10V18H12V12H8v6H2V10Z"/></svg>
  ),
  feu: (
    <svg width="20" height="20" fill="currentColor"><path d="M10 0C7 5 12 7 8 12c-3 4 1 8 2 8s5-3 5-7c0-2-1-3-2-5 2 1 4 4 4 7 0 4-3 7-7 7s-7-3-7-7c0-5 5-9 7-15Z"/></svg>
  ),
  orientation: (
    <svg width="20" height="20" fill="currentColor"><path d="M10 0l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"/></svg>
  ),
  sante: (
    <svg width="20" height="20" fill="currentColor"><path d="M8 2h4v6h6v4h-6v6H8v-6H2V8h6V2Z"/></svg>
  ),
  psychologie: (
    <svg width="20" height="20" fill="currentColor"><path d="M10 0a8 8 0 100 16h1l2 4 2-1-1-4a8 8 0 00-4-15Z"/></svg>
  )
};

export default function Documentation() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".doc-section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const sections = [
    {
      id: "intro",
      title: "Introduction",
      desc: "Survivre sans Internet, c’est survivre sans technologie. Ce guide couvre les bases essentielles : eau, nourriture, abri, feu, orientation, santé et mental."
    },
    {
      id: "eau",
      title: "Trouver et purifier de l’eau",
      desc: "L’eau est prioritaire : un être humain survit rarement plus de 3 jours sans boire. Méthodes : recueillir la rosée avec un tissu, récupérer l’eau de pluie, filtrer avec un mélange charbon/sable/tissu, ou faire bouillir au feu."
    },
    {
      id: "nourriture",
      title: "Rations et nourriture",
      desc: "Les rations doivent être caloriques et durables : riz, légumineuses, conserves, barres énergétiques. La chasse et la pêche complètent. La cueillette est possible mais nécessite la reconnaissance des plantes (éviter les fruits brillants ou inconnus)."
    },
    {
      id: "abri",
      title: "Construire un abri",
      desc: "Un abri protège du froid, de la pluie et des animaux. Techniques : abri en A avec branches, igloo de neige, abri sous roche, ou simple tarp/poncho suspendu entre deux arbres."
    },
    {
      id: "feu",
      title: "Allumer et entretenir un feu",
      desc: "Le feu permet de cuire, purifier l’eau, réchauffer et éloigner les animaux. Méthodes : briquet, pierre et acier, friction avec arc. Toujours garder du petit bois sec et ventiler par dessous pour entretenir la combustion."
    },
    {
      id: "orientation",
      title: "S’orienter sans GPS",
      desc: "Repères naturels :\n• Le soleil (Est à l’aube, Ouest au crépuscule).\n• L’étoile polaire indique le Nord.\n• La mousse pousse plus souvent au Nord des arbres.\n• Suivre un cours d’eau permet souvent de rejoindre des zones habitées."
    },
    {
      id: "sante",
      title: "Premiers secours",
      desc: "Toujours avoir une trousse : pansements, désinfectant, cordelette, couteau. En cas de blessure : nettoyer, compresser, bander. Pour fractures : immobiliser avec une attelle improvisée. Maintenir la chaleur corporelle est essentiel."
    },
    {
      id: "psychologie",
      title: "Mental et organisation",
      desc: "Le moral est vital. Appliquer la règle des 3 : 3 minutes sans oxygène, 3 heures sans abri par temps froid, 3 jours sans eau, 3 semaines sans nourriture. Organiser ses priorités et garder un esprit positif."
    }
  ];

  return (
    <section className="container" style={{ padding: "40px 20px", maxWidth: 880, margin: "0 auto" }}>
      <div className="home-card">
        <h1 className="module-title" style={{ marginBottom: 10 }}>
          Guide complet de survie
        </h1>
        <p className="module-desc" style={{ marginBottom: 20 }}>
          Apprends à survivre sans Internet ni technologie. Utilise le sommaire pour naviguer rapidement.
        </p>

        {/* Sommaire stylé */}
        <nav className="doc-nav">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="doc-nav-btn">
              {icons[s.id]} <span>{s.title}</span>
            </a>
          ))}
        </nav>

        {sections.map((s, idx) => (
          <article
            id={s.id}
            key={s.id}
            className="doc-section"
            style={{
              borderLeft: "6px solid var(--peach)",
              background: "rgba(255,255,255,.95)",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0 10px 28px rgba(0,0,0,.08)",
              opacity: 0,
              transform: idx % 2 === 0 ? "translateX(-40px)" : "translateX(40px)",
              transition: "all .6s ease"
            }}
          >
            <h2 className="module-title">{s.title}</h2>
            <p className="module-desc" style={{ whiteSpace: "pre-line" }}>{s.desc}</p>
          </article>
        ))}

        <div className="module-card" style={{ marginTop: 30 }}>
          <h3 className="module-title">À retenir</h3>
          <ul style={{ margin: "8px 0 0 18px", textAlign: "left" }}>
            <li>L’eau est prioritaire → trouver, filtrer, purifier.</li>
            <li>Les rations sèches et caloriques assurent l’énergie.</li>
            <li>Un abri et un feu garantissent chaleur et sécurité.</li>
            <li>Le soleil et les étoiles permettent de s’orienter.</li>
            <li>Premiers secours et mental sont essentiels.</li>
          </ul>
        </div>
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="btn primary"
          style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            borderRadius: "50%",
            width: 50,
            height: 50
          }}
        >
          ↑
        </button>
      )}
    </section>
  );
}
