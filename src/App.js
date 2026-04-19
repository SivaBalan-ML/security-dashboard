import { useState, useEffect } from 'react';

function ScoreCard({ score, dark }) {
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f97316' : '#ef4444'
  const label = score >= 80 ? 'Good' : score >= 50 ? 'At Risk' : 'Critical'
  return (
    <div style={{ border: `2px solid ${color}`, padding: '20px', width: '200px', textAlign: 'center', borderRadius: '12px', background: dark ? '#0f172a' : '#f8fafc' }}>
      <h2 style={{ margin: '0 0 10px', fontSize: '14px', color: dark ? '#94a3b8' : '#64748b' }}>SECURITY SCORE</h2>
      <h1 style={{ color: color, fontSize: '60px', margin: '0' }}>{score}</h1>
      <p style={{ color: color, fontWeight: 'bold', margin: '8px 0 0' }}>{label}</p>
    </div>
  )
}

function VulnCard({ title, severity, file, dark }) {
  const color = severity === 'Critical' ? '#ef4444' : severity === 'High' ? '#f97316' : severity === 'Medium' ? '#eab308' : '#22c55e'
  return (
    <div style={{ borderLeft: `4px solid ${color}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '10px', background: dark ? '#0f172a' : '#f8fafc', border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`, borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '14px' }}>{title}</strong>
        <span style={{ color: color, fontWeight: 'bold', fontSize: '12px', padding: '2px 10px', borderRadius: '20px', background: `${color}20` }}>{severity}</span>
      </div>
      <p style={{ color: dark ? '#64748b' : '#94a3b8', margin: '6px 0 0', fontSize: '12px', fontFamily: 'monospace' }}>{file}</p>
    </div>
  )
}

function RepoStats({ repo, dark }) {
  const statStyle = { background: dark ? '#0f172a' : '#f1f5f9', borderRadius: '10px', padding: '14px 20px', textAlign: 'center', minWidth: '80px' }
  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
      {[
        { label: 'Stars', value: repo.stars },
        { label: 'Commits', value: repo.commits },
        { label: 'Open Issues', value: repo.openIssues },
        { label: 'Language', value: repo.language },
        { label: 'Forks', value: repo.forks },
      ].map(stat => (
        <div key={stat.label} style={statStyle}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stat.value}</div>
          <div style={{ fontSize: '11px', color: dark ? '#64748b' : '#94a3b8', marginTop: '4px' }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

function App() {
  const [score, setScore] = useState(61)
  const [filter, setFilter] = useState('All')
  const [dark, setDark] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating API call — replace with real fetch() when friend's backend is ready
    // fetch('http://localhost:8000/scan').then(res => res.json()).then(data => setScore(data.score))
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const repo = {
    stars: 42,
    commits: 128,
    openIssues: 3,
    language: 'Python',
    forks: 7
  }

  const vulnerabilities = [
    { id: 1, title: 'SQL Injection', severity: 'Critical', file: 'routes/search.py' },
    { id: 2, title: 'Hardcoded API Key', severity: 'Critical', file: 'config/settings.py' },
    { id: 3, title: 'No Rate Limiting', severity: 'High', file: 'routes/auth.py' },
    { id: 4, title: 'Insecure Deserialization', severity: 'High', file: 'utils/parser.py' },
    { id: 5, title: 'Missing CORS Policy', severity: 'Medium', file: 'app.py' },
    { id: 6, title: 'Outdated Dependency', severity: 'Medium', file: 'requirements.txt' },
    { id: 7, title: 'Missing Security Headers', severity: 'Low', file: 'app.py' },
  ]

  const filtered = filter === 'All'
    ? vulnerabilities
    : vulnerabilities.filter(v => v.severity === filter)

  const counts = {
    Critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
    High: vulnerabilities.filter(v => v.severity === 'High').length,
    Medium: vulnerabilities.filter(v => v.severity === 'Medium').length,
    Low: vulnerabilities.filter(v => v.severity === 'Low').length,
  }

  const bg = dark ? '#0b1120' : '#ffffff'
  const text = dark ? '#f1f5f9' : '#0f172a'
  const border = dark ? '#1e293b' : '#e2e8f0'

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: bg, color: text, fontSize: '18px' }}>
      Scanning repository...
    </div>
  )

  return (
    <div style={{ padding: '30px', minHeight: '100vh', background: bg, color: text, fontFamily: 'system-ui, sans-serif', transition: 'all 0.3s' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: `1px solid ${border}`, paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Security Dashboard</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: dark ? '#64748b' : '#94a3b8' }}>SivaBalan-ML / my-ai-project</p>
        </div>
        <button
          onClick={() => setDark(!dark)}
          style={{ padding: '8px 18px', borderRadius: '20px', border: `1px solid ${border}`, cursor: 'pointer', background: dark ? '#1e293b' : '#f1f5f9', color: text, fontWeight: '600', fontSize: '13px' }}
        >
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Score + Repo Stats */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <ScoreCard score={score} dark={dark} />
        <RepoStats repo={repo} dark={dark} />
      </div>

      {/* Summary badges */}
      <div style={{ display: 'flex', gap: '10px', margin: '24px 0 16px', flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([sev, count]) => {
          const color = sev === 'Critical' ? '#ef4444' : sev === 'High' ? '#f97316' : sev === 'Medium' ? '#eab308' : '#22c55e'
          return (
            <div key={sev} style={{ padding: '6px 14px', borderRadius: '20px', background: `${color}20`, color: color, fontWeight: '700', fontSize: '13px' }}>
              {count} {sev}
            </div>
          )
        })}
      </div>

      {/* Filter buttons */}
      <h2 style={{ marginBottom: '12px', fontSize: '18px' }}>Vulnerabilities</h2>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['All', 'Critical', 'High', 'Medium', 'Low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px', borderRadius: '20px', border: `1px solid ${border}`,
              background: filter === f ? (dark ? '#334155' : '#1e293b') : 'transparent',
              color: filter === f ? '#fff' : text,
              cursor: 'pointer', fontWeight: filter === f ? '600' : '400', fontSize: '13px'
            }}
          >
            {f} {f !== 'All' ? `(${counts[f] || 0})` : `(${vulnerabilities.length})`}
          </button>
        ))}
      </div>

      {/* Vulnerability list */}
      {filtered.map(vuln => (
        <VulnCard key={vuln.id} title={vuln.title} severity={vuln.severity} file={vuln.file} dark={dark} />
      ))}

      {/* Footer */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: `1px solid ${border}`, fontSize: '12px', color: dark ? '#475569' : '#94a3b8', textAlign: 'center' }}>
        When friend's FastAPI is ready — replace mock data with real fetch() calls
      </div>
    </div>
  )
}

export default App;