import { useState } from 'react'

export default function Journal({ today, initialText, onSave }) {
  const [text, setText] = useState(initialText)

  return (
    <section>
      <h2>Journal ({today})</h2>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="How was your day?"
      />
      <div>
        <button type="button" onClick={() => onSave(text)}>Save Journal</button>
      </div>
    </section>
  )
}
