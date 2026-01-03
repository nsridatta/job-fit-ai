import React, { useState } from 'react'
import axios from 'axios'

export default function ResumeForm() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function analyze() {
    setLoading(true)
    setResult(null)
    try {
      if (file) {
        const fd = new FormData()
        fd.append('file', file)
        const r = await axios.post('/api/analyze/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setResult(r.data)
      } else {
        const r = await axios.post('/api/analyze/text', { text })
        setResult(r.data)
      }
    } catch (e: any) {
      alert(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12 }}>
        <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button onClick={() => { setFile(null); setText('') }}>Clear</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <textarea placeholder="Or paste your resume text here..." value={text} onChange={e => setText(e.target.value)} rows={12} style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={analyze} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</button>
      </div>

      {result && (
        <div style={{ marginTop: 20, border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
          <h3>Score: {result.totalScore} / 1000</h3>
          <div>
            {Object.entries(result.sections).map(([k, v]: any) => (
              <div key={k} style={{ marginBottom: 10 }}>
                <strong>{k}</strong>: {v.score} / {v.max} <br />
                <em>Suggestion:</em> {v.suggestion}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10 }}>
            <h4>Overall tips</h4>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{result.overallSuggestion}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
