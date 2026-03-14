/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { useRef, useState } from 'react'
import { exportData, importData } from '@/storage'

interface ExportImportProps {
  onImportComplete?: () => void
}

export function ExportImport({ onImportComplete }: ExportImportProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grammar-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    setImportMessage(null)
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      const result = importData(text)
      if (result.ok) {
        setImportMessage('Data imported. Reload to see changes.')
        onImportComplete?.()
      } else {
        setImportMessage(result.error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <section className="export-import" aria-label="Export or import data">
      <div className="export-import-buttons">
        <button type="button" className="btn btn-secondary btn-small" onClick={handleExport}>
          Export data
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImport}
          className="export-import-file-input"
          aria-label="Import backup file"
        />
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={() => inputRef.current?.click()}
        >
          Import data
        </button>
      </div>
      {importMessage && (
        <p className={`export-import-message ${importMessage.includes('imported') ? 'success' : 'error'}`} role="status">
          {importMessage}
        </p>
      )}
    </section>
  )
}
