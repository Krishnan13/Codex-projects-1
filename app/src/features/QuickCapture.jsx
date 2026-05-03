import { useState } from 'react'

export default function QuickCapture({ onSave }) {
  const [text, setText] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    onSave(value)
    setText('')
  }

  return (
    <form onSubmit={submit}>
      <h2>Quick Capture</h2>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Capture a thought, task, or note"
      />
      <button type="submit">Save</button>
    </form>
  )
}
