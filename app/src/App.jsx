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

const TABS = [
  { id: 'capture', label: 'Capture',  icon: '⚡' },
  { id: 'tasks',   label: 'Tasks',    icon: '✓'  },
  { id: 'habits',  label: 'Habits',   icon: '↺'  },
  { id: 'journal', label: 'Journal',  icon: '✦'  },
  { id: 'summary', label: 'Summary',  icon: '◈'  },
  { id: 'backup',  label: 'Backup',   icon: '⇅'  },
]

function App() {
  const [tab, setTab] = useState('capture')
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
    <div className="app">
      <header className="header">
        <span className="logo">
          <span className="logo-dot" />
          Life Dashboard
        </span>
        <nav className="nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="nav-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="content">
        {tab === 'capture' && (
          <QuickCapture
            captures={captures}
            onSave={(text) => { addCapture(text); refresh() }}
          />
        )}
        {tab === 'tasks' && (
          <TaskList
            tasks={tasks}
            onAdd={(title) => { addTask(title); refresh() }}
            onToggle={(id) => { toggleTask(id); refresh() }}
            onDelete={(id) => { deleteTask(id); refresh() }}
          />
        )}
        {tab === 'habits' && (
          <Habits
            habits={habits}
            today={today}
            onAdd={(name) => { addHabit(name); refresh() }}
            onToggleToday={(id) => { toggleHabitForDate(id, today); refresh() }}
            onDelete={(id) => { deleteHabit(id); refresh() }}
          />
        )}
        {tab === 'journal' && (
          <Journal
            key={`${today}:${refreshKey}`}
            today={today}
            initialText={getJournalEntryByDate(today)?.text || ''}
            onSave={(text) => { upsertJournalEntry(text, today); refresh() }}
          />
        )}
        {tab === 'summary' && (
          <WeeklySummary tasks={tasks} habits={habits} entries={entries} today={today} />
        )}
        {tab === 'backup' && (
          <BackupControls onExport={downloadBackup} onImport={uploadBackup} />
        )}
      </main>
    </div>
  )
}

export default App
