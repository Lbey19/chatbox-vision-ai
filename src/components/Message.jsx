export default function Message({ data, mine }) {
  return (
    <div className={`msg ${mine ? "mine" : ""}`}>
      <div className="bubble">
        <div className="meta">
          <span className="author">{data.author}</span>
          <span className="time">
            {data.timestamp
              ? new Date(data.timestamp).toLocaleTimeString()
              : data.time}
          </span>
        </div>

        {/* Texte */}
        {data.text && <div className="text">{data.text}</div>}

        {/* Fichier */}
        {data.fileUrl && (
          <div className="file-attachment" style={{ marginTop: "8px" }}>
            {data.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={data.fileUrl}
                alt="fichier"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
            ) : (
              <a
                href={data.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn soft"
              >
                Télécharger le fichier
              </a>
            )}
          </div>
        )}

        {/* Sources (pour les messages de Vision) */}
        {data.sources && data.sources.length > 0 && (
          <div className="sources" style={{ marginTop: "8px" }}>
            <div style={{ fontSize: "0.8em", color: "#666", marginBottom: "4px" }}>
              Sources :
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {data.sources.map((source, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    padding: "2px 6px",
                    borderRadius: "12px",
                    fontSize: "0.75em",
                    border: "1px solid #bbdefb"
                  }}
                >
                  📄 {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
