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

  return (
    <section>
      <h2>Tasks</h2>
      <form onSubmit={submit} className="row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="list">
        {tasks.map((task) => (
          <li key={task.id} className="row task-item">
            <label className={task.done ? 'done' : ''}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggle(task.id)}
              />
              {task.title}
            </label>
            <button type="button" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
