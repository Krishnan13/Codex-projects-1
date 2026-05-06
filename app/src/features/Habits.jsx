import { useState } from 'react'

export default function Habits({ habits, onAdd, onToggleToday, onDelete, today }) {
  const [name, setName] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const value = name.trim()
    if (!value) return
    onAdd(value)
    setName('')
  }

  const doneCount = habits.filter((h) => h.completions.includes(today)).length

  return (
    <div>
      <h1 className="page-title">Habits</h1>
      <p className="page-desc">
        Build streaks, one day at a time.
        {habits.length > 0 && (
          <> &nbsp;·&nbsp; <strong style={{ color: 'var(--accent)' }}>{doneCount}/{habits.length}</strong> done today</>
        )}
      </p>

      <div className="card">
        <form onSubmit={submit} className="input-row">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a new habit…"
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>

        {habits.length === 0 && (
          <p className="empty">No habits yet. Add one to start tracking.</p>
        )}

        {habits.length > 0 && (
          <ul className="item-list">
            {habits.map((habit) => {
              const done = habit.completions.includes(today)
              return (
                <li key={habit.id} className={`item-row${done ? ' done-row' : ''}`}>
                  <input
                    type="checkbox"
                    className="item-check"
                    checked={done}
                    onChange={() => onToggleToday(habit.id)}
                  />
                  <span
                    className={`item-label${done ? ' done' : ''}`}
                    onClick={() => onToggleToday(habit.id)}
                  >
                    {habit.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text)', marginRight: '0.25rem' }}>
                    {habit.completions.length}d
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => onDelete(habit.id)}
                    aria-label="Delete"
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
