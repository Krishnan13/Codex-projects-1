import { useState } from 'react'

export default function QuickCapture({ onSave, captures }) {
  const [text, setText] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    onSave(value)
    setText('')
  }

  return (
    <div>
      <h1 className="page-title">Quick Capture</h1>
      <p className="page-desc">Jot down anything on your mind before it slips away.</p>

      <div className="card">
        <form onSubmit={submit} className="input-row">
          <input
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            autoFocus
          />
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
      </div>

      {captures.length > 0 && (
        <div className="card">
          <div className="card-label">Recent captures</div>
          <ul className="capture-list">
            {captures.map((c) => (
              <li key={c.id} className="capture-item">{c.text}</li>
            ))}
          </ul>
        </div>
      )}

      {captures.length === 0 && (
        <p className="empty">Nothing captured yet. Type something above.</p>
      )}
    </div>
  )
}
