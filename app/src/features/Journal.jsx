import { useState } from 'react'

export default function Journal({ today, initialText, onSave }) {
  const [text, setText] = useState(initialText)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave(text)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const formatted = new Date(`${today}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div>
      <h1 className="page-title">Journal</h1>
      <p className="page-desc">{formatted}</p>

      <div className="card">
        <div className="card-label">Today&apos;s entry</div>
        <textarea
          className="textarea"
          rows={10}
          value={text}
          onChange={(e) => { setText(e.target.value); setSaved(false) }}
          placeholder="How was your day? What are you thinking about?"
        />
        <div className="journal-footer">
          {saved && <span className="journal-saved">Saved ✓</span>}
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>
            Save entry
          </button>
        </div>
      </div>
    </div>
  )
}
