import { useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";
import { Paperclip } from "lucide-react";

export default function InputBox({ onSend, onClear, onBurst }) {
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const taRef = useRef(null);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(160, el.scrollHeight) + "px";
  }, [value]);

  function send() {
    const text = value.trim();
    if (!text && !file) return;

    onSend({ text, file });
    onBurst?.();

    setValue("");
    setFile(null);
    setShowEmoji(false);
    taRef.current?.focus();
  }

  return (
    <div className="composer-wrap">
      <div className="tools">
        {/* Emojis */}
        <button className="btn ghost" onClick={() => setShowEmoji(v => !v)}>😊</button>

        {/* Upload fichier */}
        <label className="btn ghost" style={{ cursor: "pointer" }}>
          <Paperclip size={18} />
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Clear */}
        <button className="btn ghost" onClick={onClear}>🧹</button>
      </div>

      <div className="composer-field">
        <textarea
          ref={taRef}
          className="composer"
          rows="1"
          placeholder="Écris un message… (Entrée pour envoyer)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        {showEmoji && (
          <div className="emoji-layer">
            <EmojiPicker onPick={(e)=>setValue(v=>v+e)} />
          </div>
        )}
      </div>

      <div className="send-side">
        <button className="btn primary" onClick={send}>Envoyer</button>
      </div>
    </div>
  );
}
