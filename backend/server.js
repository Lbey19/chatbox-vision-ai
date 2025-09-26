const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// uploads
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("📁 Dossier uploads créé");
}
app.use("/uploads", express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const safe = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safe);
  },
});
const upload = multer({ storage });

// SQLite
const db = new sqlite3.Database(path.join(process.cwd(), "data.db"), (err) => {
  if (err) console.error("❌ Erreur SQLite :", err.message);
  else console.log("✅ Connecté à SQLite");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel TEXT,
      author TEXT,
      content TEXT,
      fileUrl TEXT,
      recipient TEXT,
      sources TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Ajouter la colonne sources si elle n'existe pas déjà
  db.run(`ALTER TABLE messages ADD COLUMN sources TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error("Erreur lors de l'ajout de la colonne sources:", err.message);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT,
      createdBy TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName  TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(firstName, lastName)
    )
  `);
  
  // Ajouter l'utilisateur Vision automatiquement
  db.run(
    "INSERT OR IGNORE INTO users (firstName, lastName) VALUES (?, ?)",
    ["Vision", "AI"],
    function (err) {
      if (err && !err.message.includes("UNIQUE")) {
        console.error("Erreur lors de l'ajout de Vision:", err.message);
      } else if (this.changes > 0) {
        console.log("✅ Utilisateur Vision ajouté à la base de données");
      }
    }
  );
});

// upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Pas de fichier reçu" });
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.originalname });
});

//  messages
app.get("/messages/:channel", (req, res) => {
  db.all(
    "SELECT * FROM messages WHERE channel = ? ORDER BY timestamp ASC",
    [req.params.channel],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post("/messages/:channel", async (req, res) => {
  const { author, content, fileUrl, recipient, sources } = req.body;
  
  // Insérer le message original
  db.run(
    `INSERT INTO messages (channel, author, content, fileUrl, recipient, sources)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.params.channel, author || "Anonymous", content || "", fileUrl || null, recipient || null, sources ? JSON.stringify(sources) : null],
    async function (err) {
      if (err) return res.status(500).json({ error: err.message });
      
      const originalMessage = {
        id: this.lastID,
        channel: req.params.channel,
        author: author || "Anonymous",
        content: content || "",
        fileUrl: fileUrl || null,
        recipient: recipient || null,
        sources: sources || null,
        timestamp: new Date().toISOString(),
      };
      
      res.json(originalMessage);
      
      // Si le message est destiné à Vision, envoyer une requête à l'API
      if (recipient && recipient.toLowerCase() === "vision") {
        try {
          const response = await fetch("http://127.0.0.1:3001/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: content || "" }),
          });
          
          if (response.ok) {
            const data = await response.json();
            const visionReply = data.reply || "Aucune réponse de l'API";
            const visionSources = data.sources || [];
            
            // Insérer la réponse de Vision avec les sources
            db.run(
              `INSERT INTO messages (channel, author, content, fileUrl, recipient, sources)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [req.params.channel, "Vision", visionReply, null, author, JSON.stringify(visionSources)],
              function (err) {
                if (err) {
                  console.error("Erreur lors de l'insertion de la réponse Vision:", err.message);
                }
              }
            );
          } else {
            console.error("Erreur API Vision:", response.statusText);
          }
        } catch (error) {
          console.error("Erreur lors de la requête à l'API Vision:", error.message);
        }
      }
    }
  );
});

// vider un salon
app.delete("/messages/:channel", (req, res) => {
  db.run("DELETE FROM messages WHERE channel = ?", [req.params.channel], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// alerts
app.get("/alerts", (req, res) => {
  db.all("SELECT * FROM alerts ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/alerts", (req, res) => {
  const { message, createdBy } = req.body;
  if (!message) return res.status(400).json({ error: "Message requis" });

  db.run(
    "INSERT INTO alerts (message, createdBy) VALUES (?, ?)",
    [message, createdBy || "Anonyme"],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        message,
        createdBy: createdBy || "Anonyme",
        createdAt: new Date().toISOString(),
      });
    }
  );
});

// 👤 users
app.get("/users", (req, res) => {
  const sql = `
    SELECT MIN(id) AS id, firstName, lastName, MIN(createdAt) AS createdAt
    FROM users
    GROUP BY firstName, lastName
    ORDER BY createdAt DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// signup
app.post("/users", (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ error: "Prénom et nom requis" });
  }

  db.run(
    "INSERT INTO users (firstName, lastName) VALUES (?, ?)",
    [firstName, lastName],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res
            .status(409)
            .json({ error: "Ce compte existe déjà, veuillez vous connecter." });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
      });
    }
  );
});

// login
app.post("/login", (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ error: "Champs requis" });
  }
  db.get(
    "SELECT * FROM users WHERE firstName = ? AND lastName = ? LIMIT 1",
    [firstName, lastName],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: "Utilisateur non trouvé" });
      res.json(row);
    }
  );
});

// 🚀 start
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
