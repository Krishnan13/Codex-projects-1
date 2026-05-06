import { useState } from 'react'

export default function TaskList({ tasks, onAdd, onToggle, onDelete }) {
  const [title, setTitle] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const value = title.trim()
    if (!value) return
    onAdd(value)
    setTitle('')
  }

  const pending = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)

  return (
    <div>
      <h1 className="page-title">Tasks</h1>
      <p className="page-desc">Track what needs to get done.</p>

      <div className="card">
        <form onSubmit={submit} className="input-row">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task…"
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>

        {pending.length === 0 && done.length === 0 && (
          <p className="empty">No tasks yet. Add one above.</p>
        )}

        {pending.length > 0 && (
          <ul className="item-list">
            {pending.map((task) => (
              <li key={task.id} className="item-row">
                <input
                  type="checkbox"
                  className="item-check"
                  checked={false}
                  onChange={() => onToggle(task.id)}
                />
                <span className="item-label" onClick={() => onToggle(task.id)}>
                  {task.title}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => onDelete(task.id)}
                  aria-label="Delete"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {done.length > 0 && (
          <>
            {pending.length > 0 && <div className="divider" />}
            <div className="card-label" style={{ marginTop: pending.length ? 0 : '0.85rem' }}>
              Completed
            </div>
            <ul className="item-list" style={{ marginTop: '0.4rem' }}>
              {done.map((task) => (
                <li key={task.id} className="item-row done-row">
                  <input
                    type="checkbox"
                    className="item-check"
                    checked={true}
                    onChange={() => onToggle(task.id)}
                  />
                  <span className="item-label done" onClick={() => onToggle(task.id)}>
                    {task.title}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => onDelete(task.id)}
                    aria-label="Delete"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
