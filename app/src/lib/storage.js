const KEYS = {
  captures: 'pld:quickCaptures',
  tasks: 'pld:tasks',
  habits: 'pld:habits',
  journal: 'pld:journal'
}

const read = (key) => JSON.parse(localStorage.getItem(key) || '[]')
const write = (key, rows) => localStorage.setItem(key, JSON.stringify(rows))

const makeId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const listCaptures = () => read(KEYS.captures)
export const listTasks = () => read(KEYS.tasks)
export const listHabits = () => read(KEYS.habits)
export const listJournalEntries = () => read(KEYS.journal)

export const addCapture = (text) => {
  const row = { id: makeId(), text, createdAt: new Date().toISOString() }
  write(KEYS.captures, [row, ...listCaptures()])
  return row
}

export const addTask = (title) => {
  const row = { id: makeId(), title, done: false, createdAt: new Date().toISOString(), completedAt: null }
  write(KEYS.tasks, [row, ...listTasks()])
  return row
}

export const toggleTask = (id) => {
  const next = listTasks().map((task) =>
    task.id === id
      ? { ...task, done: !task.done, completedAt: !task.done ? new Date().toISOString() : null }
      : task
  )
  write(KEYS.tasks, next)
}

export const deleteTask = (id) => write(KEYS.tasks, listTasks().filter((task) => task.id !== id))

export const addHabit = (name) => {
  const row = { id: makeId(), name, completions: [] }
  write(KEYS.habits, [...listHabits(), row])
}

export const toggleHabitForDate = (id, date) => {
  const next = listHabits().map((habit) => {
    if (habit.id !== id) return habit
    const done = habit.completions.includes(date)
    return {
      ...habit,
      completions: done ? habit.completions.filter((d) => d !== date) : [...habit.completions, date]
    }
  })
  write(KEYS.habits, next)
}

export const deleteHabit = (id) => write(KEYS.habits, listHabits().filter((habit) => habit.id !== id))

export const upsertJournalEntry = (text, date) => {
  const entries = listJournalEntries()
  const existing = entries.find((entry) => entry.date === date)

  if (existing) {
    const next = entries.map((entry) =>
      entry.date === date ? { ...entry, text, updatedAt: new Date().toISOString() } : entry
    )
    write(KEYS.journal, next)
    return
  }

  const row = { id: makeId(), date, text, createdAt: new Date().toISOString(), updatedAt: null }
  write(KEYS.journal, [row, ...entries])
}

export const getJournalEntryByDate = (date) => listJournalEntries().find((entry) => entry.date === date)

export const exportBackup = () => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  data: {
    captures: listCaptures(),
    tasks: listTasks(),
    habits: listHabits(),
    journal: listJournalEntries()
  }
})

export const importBackup = (backup) => {
  const data = backup?.data
  if (!data) throw new Error('Invalid backup file format.')

  write(KEYS.captures, Array.isArray(data.captures) ? data.captures : [])
  write(KEYS.tasks, Array.isArray(data.tasks) ? data.tasks : [])
  write(KEYS.habits, Array.isArray(data.habits) ? data.habits : [])
  write(KEYS.journal, Array.isArray(data.journal) ? data.journal : [])
}
