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

  return (
    <section>
      <h2>Habits</h2>
      <form onSubmit={submit} className="row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a habit" />
        <button type="submit">Add</button>
      </form>
      <ul className="list">
        {habits.map((habit) => {
          const doneToday = habit.completions.includes(today)
          return (
            <li key={habit.id} className="row task-item">
              <label className={doneToday ? 'done' : ''}>
                <input type="checkbox" checked={doneToday} onChange={() => onToggleToday(habit.id)} />
                {habit.name}
              </label>
              <button type="button" onClick={() => onDelete(habit.id)}>Delete</button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
