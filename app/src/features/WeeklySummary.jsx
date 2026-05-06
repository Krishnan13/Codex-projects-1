export default function WeeklySummary({ tasks, habits, entries, today }) {
  const end = new Date(`${today}T00:00:00.000Z`)
  const start = new Date(end)
  start.setUTCDate(end.getUTCDate() - 6)

  const inRange = (iso) => {
    if (!iso) return false
    const d = new Date(iso)
    return d >= start && d <= end
  }

  const completedTasks = tasks.filter((t) => t.done && inRange(t.completedAt)).length
  const createdTasks = tasks.filter((t) => inRange(t.createdAt)).length
  const journalDays = entries.filter((e) => inRange(`${e.date}T00:00:00.000Z`) && e.text.trim()).length
  const habitCompletions = habits.reduce((acc, h) => {
    return acc + h.completions.filter((d) => inRange(`${d}T00:00:00.000Z`)).length
  }, 0)

  const startFormatted = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const endFormatted = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  const stats = [
    { value: createdTasks,    label: 'Tasks created'    },
    { value: completedTasks,  label: 'Tasks completed'  },
    { value: habitCompletions,label: 'Habit check-ins'  },
    { value: journalDays,     label: 'Journal days'     },
  ]

  return (
    <div>
      <h1 className="page-title">Weekly Summary</h1>
      <p className="page-desc stat-range">{startFormatted} – {endFormatted}</p>

      <div className="card">
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
