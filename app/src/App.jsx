import { useMemo, useState } from 'react'
import './App.css'
import QuickCapture from './features/QuickCapture'
import TaskList from './features/TaskList'
import Habits from './features/Habits'
import Journal from './features/Journal'
import WeeklySummary from './features/WeeklySummary'
import BackupControls from './features/BackupControls'
import {
  addCapture,
  listCaptures,
  listTasks,
  addTask,
  toggleTask,
  deleteTask,
  listHabits,
  addHabit,
  toggleHabitForDate,
  deleteHabit,
  getJournalEntryByDate,
  upsertJournalEntry,
  listJournalEntries,
  exportBackup,
  importBackup
} from './lib/storage'

function App() {
  const [captures, setCaptures] = useState(() => listCaptures())
  const [tasks, setTasks] = useState(() => listTasks())
  const [habits, setHabits] = useState(() => listHabits())
  const [entries, setEntries] = useState(() => listJournalEntries())
  const [refreshKey, setRefreshKey] = useState(0)
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const refresh = () => {
    setCaptures(listCaptures())
    setTasks(listTasks())
    setHabits(listHabits())
    setEntries(listJournalEntries())
    setRefreshKey((k) => k + 1)
  }

  const downloadBackup = () => {
    const json = JSON.stringify(exportBackup(), null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `pld-backup-${today}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const uploadBackup = async (file) => {
    const text = await file.text()
    importBackup(JSON.parse(text))
    refresh()
  }

  return (
    <main className="container">
      <h1>Personal Life Dashboard</h1>
      <p>Core v1 complete: Capture, Tasks, Habits, Journal, Weekly Summary, Backup.</p>

      <QuickCapture onSave={(text) => { addCapture(text); refresh() }} />
      <section>
        <h3>Recent captures</h3>
        <ul className="list">{captures.map((c) => <li key={c.id}>{c.text}</li>)}</ul>
      </section>

      <TaskList
        tasks={tasks}
        onAdd={(title) => { addTask(title); refresh() }}
        onToggle={(id) => { toggleTask(id); refresh() }}
        onDelete={(id) => { deleteTask(id); refresh() }}
      />

      <Habits
        habits={habits}
        today={today}
        onAdd={(name) => { addHabit(name); refresh() }}
        onToggleToday={(id) => { toggleHabitForDate(id, today); refresh() }}
        onDelete={(id) => { deleteHabit(id); refresh() }}
      />

      <Journal
        key={`${today}:${refreshKey}`}
        today={today}
        initialText={getJournalEntryByDate(today)?.text || ''}
        onSave={(text) => { upsertJournalEntry(text, today); refresh() }}
      />

      <WeeklySummary tasks={tasks} habits={habits} entries={entries} today={today} />
      <BackupControls onExport={downloadBackup} onImport={uploadBackup} />
    </main>
  )
}

export default App
