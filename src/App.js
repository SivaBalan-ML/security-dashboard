import { useState, useEffect } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Syne', sans-serif;
  }

  .dashboard {
    min-height: 100vh;
    padding: 32px;
    transition: background 0.4s, color 0.4s;
    position: relative;
    overflow: hidden;
  }

  .dashboard.light {
    background: #f0f2f5;
    color: #0a0a0a;
  }

  .dashboard.dark {
    background: #060a14;
    color: #e8eaf0;
  }

  /* Animated background grid */
  .grid-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.04;
    background-image:
      linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .dark .grid-bg { opacity: 0.07; }

  /* Glow orbs */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    animation: float 8s ease-in-out infinite;
  }

  .orb-1 {
    width: 400px; height: 400px;
    top: -100px; right: -100px;
    background: radial-gradient(circle, rgba(99,102,241,0.15), transparent);
  }

  .orb-2 {
    width: 300px; height: 300px;
    bottom: 100px; left: -80px;
    background: radial-gradient(circle, rgba(239,68,68,0.1), transparent);
    animation-delay: -4s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-30px); }
  }

  .content { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 36px;
    padding-bottom: 28px;
    border-bottom: 1px solid rgba(99,102,241,0.2);
  }

  .header-left { display: flex; align-items: center; gap: 16px; }

  .shield-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 0 20px rgba(99,102,241,0.4);
    animation: pulse-glow 3s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4); }
    50% { box-shadow: 0 0 35px rgba(99,102,241,0.7); }
  }

  .header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .header-sub {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    margin-top: 4px;
    opacity: 0.5;
  }

  .toggle-btn {
    padding: 9px 20px;
    border-radius: 50px;
    border: 1px solid rgba(99,102,241,0.3);
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s;
    backdrop-filter: blur(10px);
  }

  .light .toggle-btn {
    background: rgba(255,255,255,0.8);
    color: #0a0a0a;
  }

  .dark .toggle-btn {
    background: rgba(255,255,255,0.05);
    color: #e8eaf0;
  }

  .toggle-btn:hover {
    background: rgba(99,102,241,0.2);
    border-color: rgba(99,102,241,0.6);
    transform: translateY(-1px);
  }

  /* Score section */
  .top-section {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    flex-wrap: wrap;
    align-items: stretch;
  }

  .score-card {
    border-radius: 20px;
    padding: 28px 32px;
    min-width: 200px;
    text-align: center;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    transition: transform 0.3s;
  }

  .score-card:hover { transform: translateY(-3px); }

  .light .score-card { background: #ffffff; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .dark .score-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }

  .score-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    opacity: 0.5;
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  .score-number {
    font-family: 'Syne', sans-serif;
    font-size: 72px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 8px;
  }

  .score-status {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 4px 14px;
    border-radius: 50px;
    display: inline-block;
    margin-top: 6px;
  }

  /* Repo stats */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 12px;
    flex: 1;
    align-content: start;
  }

  .stat-box {
    border-radius: 16px;
    padding: 16px 12px;
    text-align: center;
    transition: transform 0.2s;
  }

  .stat-box:hover { transform: translateY(-2px); }
  .light .stat-box { background: #ffffff; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  .dark .stat-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
  }

  .stat-label {
    font-size: 11px;
    opacity: 0.45;
    margin-top: 4px;
    font-family: 'Space Mono', monospace;
  }

  /* Badge row */
  .badge-row {
    display: flex;
    gap: 10px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .badge {
    padding: 7px 16px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.2s;
  }

  .badge:hover { transform: scale(1.05); }

  /* Section title */
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(99,102,241,0.2);
  }

  /* Filter buttons */
  .filter-row {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 7px 18px;
    border-radius: 50px;
    border: 1px solid transparent;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .light .filter-btn { background: #ffffff; color: #0a0a0a; border-color: #e2e8f0; }
  .dark .filter-btn { background: rgba(255,255,255,0.05); color: #e8eaf0; border-color: rgba(255,255,255,0.1); }

  .filter-btn.active {
    background: #6366f1 !important;
    color: #fff !important;
    border-color: #6366f1 !important;
    box-shadow: 0 4px 14px rgba(99,102,241,0.4);
  }

  .filter-btn:hover:not(.active) {
    border-color: rgba(99,102,241,0.5);
    color: #6366f1;
  }

  /* Vuln cards */
  .vuln-card {
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
    animation: slideIn 0.3s ease forwards;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .vuln-card:hover { transform: translateX(4px); }

  .light .vuln-card { background: #ffffff; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  .dark .vuln-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); }

  .vuln-left { display: flex; align-items: center; gap: 14px; }

  .vuln-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 8px currentColor;
  }

  .vuln-title {
    font-size: 15px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
  }

  .vuln-file {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    opacity: 0.45;
    margin-top: 3px;
  }

  .vuln-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 50px;
    font-family: 'Space Mono', monospace;
    letter-spacing: 0.5px;
    flex-shrink: 0;
  }

  /* Accent bar on left */
  .vuln-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
  }

  /* Loading */
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 20px;
  }

  .loading-text {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    opacity: 0.6;
    animation: blink 1.2s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }

  .spinner {
    width: 40px; height: 40px;
    border: 3px solid rgba(99,102,241,0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Footer */
  .footer {
    margin-top: 48px;
    padding-top: 24px;
    text-align: center;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    opacity: 0.3;
    letter-spacing: 1px;
  }
`;

function ScoreCard({ score, dark }) {
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f97316' : '#ef4444';
  const label = score >= 80 ? 'SECURE' : score >= 50 ? 'AT RISK' : 'CRITICAL';
  const bgColor = score >= 80 ? 'rgba(34,197,94,0.1)' : score >= 50 ? 'rgba(249,115,22,0.1)' : 'rgba(239,68,68,0.1)';

  return (
    <div className="score-card">
      <div className="score-label">Security Score</div>
      <div className="score-number" style={{ color }}>{score}</div>
      <div className="score-status" style={{ color, background: bgColor }}>{label}</div>
    </div>
  );
}

function RepoStats({ repo, dark }) {
  const stats = [
    { label: 'Stars', value: repo.stars, icon: '★' },
    { label: 'Commits', value: repo.commits, icon: '↑' },
    { label: 'Issues', value: repo.openIssues, icon: '!' },
    { label: 'Language', value: repo.language, icon: '{ }' },
    { label: 'Forks', value: repo.forks, icon: '⑂' },
  ];

  return (
    <div className="stats-grid">
      {stats.map(stat => (
        <div key={stat.label} className="stat-box">
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function VulnCard({ title, severity, file, dark }) {
  const colorMap = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#22c55e',
  };
  const color = colorMap[severity];

  return (
    <div className="vuln-card" style={{ '--accent': color }}>
      <style>{`.vuln-card::before { background: var(--accent, #6366f1); }`}</style>
      <div className="vuln-left">
        <div className="vuln-dot" style={{ color, background: color }} />
        <div>
          <div className="vuln-title">{title}</div>
          <div className="vuln-file">{file}</div>
        </div>
      </div>
      <div className="vuln-badge" style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}>
        {severity}
      </div>
    </div>
  );
}

function App() {
  const [score] = useState(61);
  const [filter, setFilter] = useState('All');
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch('http://localhost:8000/scan').then(res => res.json()).then(data => setScore(data.score))
    setTimeout(() => setLoading(false), 1400);
  }, []);

  const repo = { stars: 42, commits: 128, openIssues: 3, language: 'Python', forks: 7 };

  const vulnerabilities = [
    { id: 1, title: 'SQL Injection', severity: 'Critical', file: 'routes/search.py' },
    { id: 2, title: 'Hardcoded API Key', severity: 'Critical', file: 'config/settings.py' },
    { id: 3, title: 'No Rate Limiting', severity: 'High', file: 'routes/auth.py' },
    { id: 4, title: 'Insecure Deserialization', severity: 'High', file: 'utils/parser.py' },
    { id: 5, title: 'Missing CORS Policy', severity: 'Medium', file: 'app.py' },
    { id: 6, title: 'Outdated Dependency', severity: 'Medium', file: 'requirements.txt' },
    { id: 7, title: 'Missing Security Headers', severity: 'Low', file: 'app.py' },
  ];

  const counts = {
    Critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
    High: vulnerabilities.filter(v => v.severity === 'High').length,
    Medium: vulnerabilities.filter(v => v.severity === 'Medium').length,
    Low: vulnerabilities.filter(v => v.severity === 'Low').length,
  };

  const filtered = filter === 'All' ? vulnerabilities : vulnerabilities.filter(v => v.severity === filter);

  const badgeColors = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className={`dashboard ${dark ? 'dark' : 'light'} loading`}>
        <div className="grid-bg" />
        <div className="spinner" />
        <div className="loading-text">// scanning repository...</div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className={`dashboard ${dark ? 'dark' : 'light'}`}>
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="content">
          {/* Header */}
          <div className="header">
            <div className="header-left">
              <div className="shield-icon">🛡️</div>
              <div>
                <h1>Security Dashboard</h1>
                <div className="header-sub">SivaBalan-ML / my-ai-project</div>
              </div>
            </div>
            <button className="toggle-btn" onClick={() => setDark(!dark)}>
              {dark ? '☀ Light' : '◑ Dark'}
            </button>
          </div>

          {/* Score + Stats */}
          <div className="top-section">
            <ScoreCard score={score} dark={dark} />
            <RepoStats repo={repo} dark={dark} />
          </div>

          {/* Badges */}
          <div className="badge-row">
            {Object.entries(counts).map(([sev, count]) => (
              <div key={sev} className="badge" style={{ color: badgeColors[sev], background: `${badgeColors[sev]}15`, border: `1px solid ${badgeColors[sev]}30` }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: badgeColors[sev], display: 'inline-block', boxShadow: `0 0 6px ${badgeColors[sev]}` }} />
                {count} {sev}
              </div>
            ))}
          </div>

          {/* Vulnerabilities */}
          <div className="section-title">Vulnerabilities</div>

          <div className="filter-row">
            {['All', 'Critical', 'High', 'Medium', 'Low'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f} ({f === 'All' ? vulnerabilities.length : counts[f] || 0})
              </button>
            ))}
          </div>

          {filtered.map(vuln => (
            <VulnCard key={vuln.id} title={vuln.title} severity={vuln.severity} file={vuln.file} dark={dark} />
          ))}

          <div className="footer">
            // CONNECT FASTAPI → replace mock data with real fetch() calls
          </div>
        </div>
      </div>
    </>
  );
}

export default App;