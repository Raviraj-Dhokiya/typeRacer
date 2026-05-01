export default function TextDisplay({ text, typed, isActive }) {
  return (
    <div className="text-display" aria-label="Typing text">
      {text.split('').map((char, i) => {
        let cls = ''
        if (i < typed.length) {
          cls = typed[i] === char ? 'correct' : 'error'
        } else if (i === typed.length && isActive) {
          cls = 'active'
        }
        return (
          <span key={i} className={`char ${cls}`}>
            {char}
          </span>
        )
      })}
    </div>
  )
}
