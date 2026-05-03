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

  const habitCompletions = habits.reduce((acc, habit) => {
    const weekly = habit.completions.filter((d) => inRange(`${d}T00:00:00.000Z`)).length
    return acc + weekly
  }, 0)

  return (
    <section>
      <h2>Weekly Summary</h2>
      <p>Range: last 7 days ending {today}</p>
      <ul className="list">
        <li>Tasks created: {createdTasks}</li>
        <li>Tasks completed: {completedTasks}</li>
        <li>Habit check-ins: {habitCompletions}</li>
        <li>Journal days written: {journalDays}</li>
      </ul>
    </section>
  )
}
