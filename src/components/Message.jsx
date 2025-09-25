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
      </div>
    </div>
  );
}
