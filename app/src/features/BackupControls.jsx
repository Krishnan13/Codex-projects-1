import { useRef } from 'react'

export default function BackupControls({ onExport, onImport }) {
  const fileRef = useRef(null)

  return (
    <section>
      <h2>Backup & Restore</h2>
      <div className="row">
        <button type="button" onClick={onExport}>Export JSON Backup</button>
        <button type="button" onClick={() => fileRef.current?.click()}>Import JSON Backup</button>
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
    </section>
  )
}
