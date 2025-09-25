export default function EmojiPicker({ onPick }) {
  const emojis = ["😀","😎","😊","🤝","🎉","⭐","🔥","❤️","👍","🧡","🥳","🤩","💡","🌟"];
  return (
    <div className="emoji-pop">
      {emojis.map((e, i) => (
        <button key={i} className="emoji-btn" onClick={() => onPick(e)}>{e}</button>
      ))}
    </div>
  );
}
