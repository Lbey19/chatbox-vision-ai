import { useState } from "react";

const icons = {
  explosion: (
    <svg width="64" height="64" fill="red" viewBox="0 0 24 24">
      <path d="M12 2L15 8l7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" />
    </svg>
  ),
  success: (
    <svg width="48" height="48" fill="green" viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5 1.41-1.41L9 14.17 18.59 4.59 20 6z" />
    </svg>
  )
};

export default function Quiz() {
  const questions = [
    {
      q: "Quelle est la ressource la plus prioritaire pour survivre ?",
      answers: ["La nourriture", "L’eau potable", "L’abri"],
      correct: 1,
      explain: "L’eau est prioritaire : un être humain ne survit pas plus de 3 jours sans boire."
    },
    {
      q: "Comment purifier de l’eau trouvée dans la nature ?",
      answers: ["En la faisant bouillir", "En la laissant reposer", "En la mélangeant avec du sel"],
      correct: 0,
      explain: "Faire bouillir l’eau est la méthode la plus simple et efficace pour tuer les microbes."
    },
    {
      q: "Quel est le rôle principal d’un abri ?",
      answers: ["Se reposer confortablement", "Protéger du froid et de la pluie", "Ranger ses affaires"],
      correct: 1,
      explain: "Un abri sert avant tout à protéger du froid, de l’humidité et des animaux."
    },
    {
      q: "Pourquoi le feu est-il essentiel en survie ?",
      answers: ["Pour signaler sa présence, cuire et se réchauffer", "Pour éloigner les moustiques uniquement", "Juste pour la lumière"],
      correct: 0,
      explain: "Le feu réchauffe, permet de cuire, purifier l’eau et éloigner les animaux."
    },
    {
      q: "Comment trouver le Nord sans boussole ?",
      answers: ["En observant la mousse sur les arbres", "En cherchant des fourmis", "En suivant les nuages"],
      correct: 0,
      explain: "La mousse pousse généralement au Nord des arbres, et l’étoile polaire indique aussi le Nord la nuit."
    },
    {
      q: "Quelle est la règle des 3 en survie ?",
      answers: [
        "3 minutes sans oxygène, 3 heures sans abri, 3 jours sans eau, 3 semaines sans nourriture",
        "3 jours sans eau, 3 semaines sans nourriture, 3 mois sans abri",
        "3 heures sans nourriture, 3 jours sans eau, 3 semaines sans sommeil"
      ],
      correct: 0,
      explain: "C’est la règle des priorités vitales : oxygène → abri → eau → nourriture."
    }
  ];

  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [explosion, setExplosion] = useState(false);

  const current = questions[step];

  function handleAnswer(i) {
    if (selected !== null) return;
    setSelected(i);
    setShowExplain(true);

    const isCorrect = i === current.correct;
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setExplosion(true);
      setTimeout(() => setExplosion(false), 1200);
    }
  }

  function handleNext() {
    setSelected(null);
    setShowExplain(false);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setStep("end");
    }
  }

  if (step === "end") {
    return (
      <div className="home-card" style={{ textAlign: "center", margin: "40px auto", maxWidth: 600 }}>
        {icons.success}
        <h2 className="quiz-final">Bravo !</h2>
        <p>Tu as obtenu <b>{score}</b> / {questions.length} bonnes réponses.</p>
        <p>Tu connais désormais les bases essentielles de la survie.</p>
        <button className="btn primary" onClick={() => { setStep(0); setScore(0); }}>
          Rejouer
        </button>
      </div>
    );
  }

  return (
    <div className="home-card" style={{ margin: "40px auto", maxWidth: 600, position: "relative" }}>

      {explosion && (
        <div className="explosion-overlay">
          <div className="explosion-icon">{icons.explosion}</div>
          <div className="explosion-text">Mauvaise réponse</div>
        </div>
      )}

      <h2 className="quiz-question">Question {step + 1} / {questions.length}</h2>
      <p style={{ marginBottom: 20 }}>{current.q}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {current.answers.map((ans, i) => {
          const isCorrect = i === current.correct;
          const isSelected = selected === i;

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`btn quiz-answer ${
                isSelected
                  ? isCorrect
                    ? "answer-ok"
                    : "answer-bad"
                  : ""
              }`}
              style={{ textAlign: "left" }}
            >
              {ans}
            </button>
          );
        })}
      </div>

      {showExplain && (
        <div className="explain-block" style={{ marginTop: 20 }}>
          <p>{current.explain}</p>
          <button className="btn primary" style={{ marginTop: 12 }} onClick={handleNext}>
            {step + 1 < questions.length ? "Question suivante" : "Voir le résultat"}
          </button>
        </div>
      )}

      {/* Progression */}
      <div className="quiz-progress" style={{ marginTop: 20 }}>
        <div
          className="quiz-progress-fill"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
