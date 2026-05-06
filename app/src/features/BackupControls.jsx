import { useRef } from 'react'

export default function BackupControls({ onExport, onImport }) {
  const fileRef = useRef(null)

  return (
    <div>
      <h1 className="page-title">Backup & Restore</h1>
      <p className="page-desc">Keep your data safe with a local JSON backup.</p>

      <div className="card">
        <div className="card-label">Export</div>
        <p className="backup-desc">
          Download a full snapshot of your captures, tasks, habits, and journal entries.
        </p>
        <div className="backup-actions">
          <button type="button" className="btn btn-primary" onClick={onExport}>
            ↓ &nbsp;Download backup
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-label">Import</div>
        <p className="backup-desc">
          Restore from a previously exported JSON file. This will overwrite all current data.
        </p>
        <div className="backup-actions">
          <button type="button" className="btn btn-outline" onClick={() => fileRef.current?.click()}>
            ↑ &nbsp;Choose file to restore
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onImport(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}
