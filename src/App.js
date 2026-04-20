import { useState, useEffect, useRef } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cyan: #00f5ff;
    --cyan-dim: rgba(0,245,255,0.15);
    --cyan-glow: rgba(0,245,255,0.4);
    --red: #ff2d55;
    --orange: #ff6b2b;
    --yellow: #ffd60a;
    --green: #00ff88;
    --bg: #020812;
    --panel: rgba(0,245,255,0.03);
    --border: rgba(0,245,255,0.12);
    --border-bright: rgba(0,245,255,0.35);
    --text: #c8f0ff;
    --text-dim: rgba(200,240,255,0.4);
  }

  html, body { background: #020812; }

  .app {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'Rajdhani', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* ── CANVAS BACKGROUND ── */
  #matrix-canvas {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
    opacity: 0.18;
  }

  /* Scan line overlay */
  .scanlines {
    position: fixed; inset: 0; pointer-events: none; z-index: 1;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.08) 2px,
      rgba(0,0,0,0.08) 4px
    );
  }

  /* Corner glow */
  .corner-glow {
    position: fixed; pointer-events: none; z-index: 0;
    border-radius: 50%; filter: blur(100px);
  }
  .corner-glow.tl { width:500px;height:500px;top:-200px;left:-200px;background:radial-gradient(circle,rgba(0,245,255,0.08),transparent 70%); }
  .corner-glow.br { width:400px;height:400px;bottom:-150px;right:-150px;background:radial-gradient(circle,rgba(255,45,85,0.07),transparent 70%); }
  .corner-glow.tr { width:300px;height:300px;top:200px;right:-100px;background:radial-gradient(circle,rgba(0,255,136,0.05),transparent 70%); }

  /* ── MAIN ── */
  .main { position: relative; z-index: 2; max-width: 1000px; margin: 0 auto; padding: 28px 24px; }

  /* ── HEADER ── */
  .header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 32px; padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
    position: relative;
  }

  .header::after {
    content: '';
    position: absolute; bottom: -1px; left: 0;
    width: 200px; height: 1px;
    background: linear-gradient(90deg, var(--cyan), transparent);
  }

  .brand { display: flex; align-items: center; gap: 16px; }

  /* Hexagon icon */
  .hex-icon {
    position: relative; width: 56px; height: 56px;
    display: flex; align-items: center; justify-content: center;
  }

  .hex-icon svg.hex-bg {
    position: absolute; inset: 0;
    animation: hex-rotate 20s linear infinite;
  }

  .hex-icon svg.hex-inner {
    position: relative; z-index: 1;
    animation: shield-float 3s ease-in-out infinite;
  }

  @keyframes hex-rotate { to { transform: rotate(360deg); } }
  @keyframes shield-float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }

  .brand-text { display: flex; flex-direction: column; gap: 2px; }

  .brand-title {
    font-family: 'Orbitron', monospace;
    font-size: 18px; font-weight: 900;
    color: var(--cyan);
    letter-spacing: 3px;
    text-transform: uppercase;
    text-shadow: 0 0 20px var(--cyan-glow), 0 0 40px rgba(0,245,255,0.2);
    animation: flicker 8s ease-in-out infinite;
  }

  @keyframes flicker {
    0%,95%,97%,100% { opacity: 1; }
    96% { opacity: 0.85; }
  }

  .brand-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; color: var(--text-dim);
    letter-spacing: 1px;
  }

  .header-right { display: flex; align-items: center; gap: 12px; }

  /* Threat level indicator */
  .threat-bar {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 14px;
    border: 1px solid rgba(255,107,43,0.3);
    border-radius: 4px;
    background: rgba(255,107,43,0.06);
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--orange);
    letter-spacing: 1px;
  }

  .threat-bar-dots { display: flex; gap: 3px; }
  .threat-dot {
    width: 6px; height: 6px; border-radius: 1px;
    animation: threat-blink 1.5s ease-in-out infinite;
  }
  .threat-dot:nth-child(1) { background: var(--green); animation-delay: 0s; }
  .threat-dot:nth-child(2) { background: var(--yellow); animation-delay: 0.2s; }
  .threat-dot:nth-child(3) { background: var(--orange); animation-delay: 0.4s; }
  .threat-dot:nth-child(4) { background: var(--red); animation-delay: 0.6s; opacity: 0.3; }
  @keyframes threat-blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .toggle-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    background: transparent;
    border: 1px solid var(--border-bright);
    border-radius: 4px;
    color: var(--cyan);
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px; letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
  }

  .toggle-btn:hover {
    background: var(--cyan-dim);
    box-shadow: 0 0 12px var(--cyan-glow);
  }

  /* ── PANELS ── */
  .panel {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 6px;
    position: relative;
    overflow: hidden;
  }

  /* Corner brackets */
  .panel::before, .panel::after {
    content: '';
    position: absolute;
    width: 12px; height: 12px;
  }

  .panel::before {
    top: -1px; left: -1px;
    border-top: 2px solid var(--cyan);
    border-left: 2px solid var(--cyan);
  }

  .panel::after {
    bottom: -1px; right: -1px;
    border-bottom: 2px solid var(--cyan);
    border-right: 2px solid var(--cyan);
  }

  .panel-label {
    position: absolute; top: -10px; left: 16px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: var(--cyan);
    background: var(--bg);
    padding: 0 6px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* ── TOP ROW ── */
  .top-row { display: grid; grid-template-columns: 220px 1fr; gap: 20px; margin-bottom: 24px; }

  /* Score */
  .score-panel { padding: 28px 24px; text-align: center; }

  .score-ring-wrap {
    position: relative;
    width: 140px; height: 140px;
    margin: 0 auto 16px;
    display: flex; align-items: center; justify-content: center;
  }

  .score-ring-wrap svg {
    position: absolute; inset: 0;
    transform: rotate(-90deg);
  }

  .score-ring-bg { fill: none; stroke: rgba(0,245,255,0.08); stroke-width: 6; }
  .score-ring-fill {
    fill: none; stroke-width: 6; stroke-linecap: round;
    stroke-dasharray: 377;
    animation: ring-fill 1.5s ease forwards;
  }

  @keyframes ring-fill {
    from { stroke-dashoffset: 377; }
  }

  .score-inner { position: relative; z-index: 1; text-align: center; }
  .score-num {
    font-family: 'Orbitron', monospace;
    font-size: 48px; font-weight: 900;
    line-height: 1;
  }
  .score-slash { font-family: 'Share Tech Mono', monospace; font-size: 14px; color: var(--text-dim); margin-top: 2px; }

  .score-status {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px; letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 3px;
    margin-top: 4px;
  }

  .score-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; letter-spacing: 3px;
    color: var(--text-dim); text-transform: uppercase;
    margin-bottom: 12px;
  }

  /* Stats */
  .stats-panel { padding: 24px 20px 20px; }

  .stats-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; letter-spacing: 2px;
    color: var(--text-dim); text-transform: uppercase;
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }

  .stats-title::after { content:''; flex:1; height:1px; background:var(--border); }

  .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }

  .stat-box {
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 14px 8px;
    text-align: center;
    background: rgba(0,245,255,0.02);
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .stat-box::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .stat-box:hover { border-color: var(--border-bright); background: var(--cyan-dim); }
  .stat-box:hover::before { opacity: 1; }

  .stat-icon-wrap {
    width: 28px; height: 28px; margin: 0 auto 8px;
    display: flex; align-items: center; justify-content: center;
  }

  .stat-val {
    font-family: 'Orbitron', monospace;
    font-size: 18px; font-weight: 700;
    color: var(--cyan);
  }

  .stat-lbl {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; color: var(--text-dim);
    letter-spacing: 1px; text-transform: uppercase;
    margin-top: 4px;
  }

  /* ── THREAT MATRIX ── */
  .threat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }

  .threat-card {
    border-radius: 4px; padding: 14px 16px;
    border: 1px solid;
    display: flex; align-items: center; gap: 12px;
    transition: transform 0.2s;
    position: relative; overflow: hidden;
  }

  .threat-card:hover { transform: translateY(-2px); }

  .threat-card::after {
    content: '';
    position: absolute; top: 0; left: 0; bottom: 0;
    width: 3px;
  }

  .threat-icon-hex {
    width: 36px; height: 36px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }

  .threat-count {
    font-family: 'Orbitron', monospace;
    font-size: 26px; font-weight: 900;
  }

  .threat-sev {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; letter-spacing: 1.5px;
    text-transform: uppercase;
    opacity: 0.7; margin-top: 2px;
  }

  /* ── VULN LIST ── */
  .section-header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 14px;
  }

  .section-title {
    font-family: 'Orbitron', monospace;
    font-size: 14px; font-weight: 700;
    color: var(--cyan); letter-spacing: 2px;
    text-transform: uppercase;
  }

  .section-line { flex:1; height:1px; background: var(--border); }
  .section-count {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; color: var(--text-dim);
  }

  .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }

  .filter-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 14px;
    border: 1px solid var(--border);
    border-radius: 3px;
    background: transparent;
    color: var(--text-dim);
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
  }

  .filter-btn:hover { border-color: var(--border-bright); color: var(--cyan); background: var(--cyan-dim); }

  .filter-btn.active {
    background: var(--cyan-dim) !important;
    border-color: var(--cyan) !important;
    color: var(--cyan) !important;
    box-shadow: 0 0 10px rgba(0,245,255,0.2), inset 0 0 10px rgba(0,245,255,0.05);
  }

  .vuln-list { display: flex; flex-direction: column; gap: 8px; }

  .vuln-card {
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 14px 18px;
    display: flex; align-items: center; gap: 14px;
    background: rgba(0,245,255,0.01);
    transition: all 0.2s;
    animation: slideIn 0.35s ease forwards;
    opacity: 0;
    position: relative; overflow: hidden;
  }

  .vuln-card::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px;
  }

  .vuln-card:hover {
    border-color: var(--border-bright);
    background: rgba(0,245,255,0.03);
    transform: translateX(4px);
  }

  @keyframes slideIn {
    from { opacity:0; transform:translateX(-16px); }
    to { opacity:1; transform:translateX(0); }
  }

  /* Hexagonal vuln icon */
  .vuln-hex {
    width: 40px; height: 40px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }

  .vuln-body { flex: 1; }

  .vuln-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px; font-weight: 700;
    color: var(--text);
  }

  .vuln-meta {
    display: flex; align-items: center; gap: 8px; margin-top: 4px;
  }

  .vuln-file {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; color: var(--text-dim);
  }

  .vuln-id {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: var(--text-dim); opacity: 0.5;
  }

  .vuln-badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; font-weight: 700;
    padding: 3px 10px; border-radius: 2px;
    letter-spacing: 1.5px; text-transform: uppercase;
    flex-shrink: 0;
  }

  /* ── FOOTER ── */
  .footer {
    margin-top: 40px; padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; color: var(--text-dim);
    letter-spacing: 1px;
  }

  .footer-left { display: flex; align-items: center; gap: 8px; }
  .footer-status { display: flex; align-items: center; gap: 6px; color: var(--green); }
  .footer-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: blink-dot 2s infinite; }
  @keyframes blink-dot { 0%,100%{opacity:1} 50%{opacity:0.2} }

  /* ── LOADING ── */
  .loading-screen {
    position: fixed; inset: 0; z-index: 100;
    background: var(--bg);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 24px;
  }

  .loading-hex { animation: spin-slow 4s linear infinite; }
  @keyframes spin-slow { to { transform: rotate(360deg); } }

  .loading-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px; color: var(--cyan);
    letter-spacing: 3px; text-transform: uppercase;
    animation: pulse-text 1.2s ease-in-out infinite;
  }

  @keyframes pulse-text { 0%,100%{opacity:0.4} 50%{opacity:1} }

  .loading-bar-wrap {
    width: 200px; height: 2px;
    background: rgba(0,245,255,0.1);
    border-radius: 2px; overflow: hidden;
  }

  .loading-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--cyan), #7c3aed);
    animation: load-progress 1.5s ease forwards;
    box-shadow: 0 0 8px var(--cyan);
  }

  @keyframes load-progress { from{width:0} to{width:100%} }

  .loading-pct {
    font-family: 'Orbitron', monospace;
    font-size: 11px; color: var(--text-dim);
    letter-spacing: 2px;
    animation: count-up 1.5s ease forwards;
  }
`;

/* ── MATRIX RAIN CANVAS ── */
function MatrixCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    let frame;
    function draw() {
      ctx.fillStyle = 'rgba(2,8,18,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00f5ff';
      ctx.font = '13px Share Tech Mono, monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : `rgba(0,245,255,${Math.random() * 0.5 + 0.1})`;
        ctx.fillText(char, i * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      frame = requestAnimationFrame(draw);
    }
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas id="matrix-canvas" ref={canvasRef} />;
}

/* ── COLORS ── */
const C = {
  Critical: { color: '#ff2d55', bg: 'rgba(255,45,85,0.08)', border: 'rgba(255,45,85,0.25)', glow: 'rgba(255,45,85,0.3)' },
  High:     { color: '#ff6b2b', bg: 'rgba(255,107,43,0.08)', border: 'rgba(255,107,43,0.25)', glow: 'rgba(255,107,43,0.3)' },
  Medium:   { color: '#ffd60a', bg: 'rgba(255,214,10,0.08)', border: 'rgba(255,214,10,0.25)', glow: 'rgba(255,214,10,0.3)' },
  Low:      { color: '#00ff88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', glow: 'rgba(0,255,136,0.3)' },
};

/* ── HEX SHAPE ── */
const HexOutline = ({ size, color, opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="none" stroke={color} strokeWidth="1.5" opacity={opacity} />
  </svg>
);

const HexFilled = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill={color} opacity="0.15" />
    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="none" stroke={color} strokeWidth="1.5" />
  </svg>
);

/* ── ICON SVGs ── */
const icons = {
  shield: (color, size=22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"/>
      <polyline points="9,12 11,14 15,10"/>
    </svg>
  ),
  bug: (color, size=16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M8 2l1.5 1.5M16 2l-1.5 1.5"/>
      <path d="M6 9a6 6 0 0 0 12 0v6a6 6 0 0 1-12 0V9z"/>
      <path d="M9 9h6M9 12h6M9 15h6"/>
      <path d="M3 10h3M18 10h3M3 14h3M18 14h3"/>
    </svg>
  ),
  alert: (color, size=16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  star: (color=`#ffd60a`, size=15) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  ),
  git: (color=`#00f5ff`, size=15) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
      <path d="M6 9v6M15.4 6.4L9 12"/>
    </svg>
  ),
  terminal: (color=`#00f5ff`, size=14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  ),
  eye: (color=`#00f5ff`, size=14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  wifi: (color=`#00ff88`, size=14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  ),
  fork: (color=`#00f5ff`, size=14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="6" cy="3" r="1.5"/><circle cx="18" cy="3" r="1.5"/><circle cx="12" cy="21" r="1.5"/>
      <path d="M6 4.5v3a6 6 0 0 0 6 6M18 4.5v3a6 6 0 0 1-6 6v3"/>
    </svg>
  ),
  issue: (color=`#ffd60a`, size=14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  code: (color=`#00f5ff`, size=14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
};

/* ── COMPONENTS ── */
function ScoreRing({ score }) {
  const color = score >= 80 ? '#00ff88' : score >= 50 ? '#ff6b2b' : '#ff2d55';
  const label = score >= 80 ? 'SECURE' : score >= 50 ? 'AT RISK' : 'CRITICAL';
  const circ = 2 * Math.PI * 60;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="score-panel panel">
      <span className="panel-label">THREAT SCORE</span>
      <div style={{ marginTop: 8 }}>
        <div className="score-ring-wrap">
          <svg viewBox="0 0 140 140" style={{ position:'absolute', inset:0, transform:'rotate(-90deg)' }}>
            <circle className="score-ring-bg" cx="70" cy="70" r="60" />
            <circle
              className="score-ring-fill"
              cx="70" cy="70" r="60"
              stroke={color}
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
          </svg>
          <div className="score-inner">
            <div className="score-num" style={{ color, textShadow: `0 0 20px ${color}` }}>{score}</div>
            <div className="score-slash">/ 100</div>
          </div>
        </div>
        <div className="score-status" style={{ background: `${color}12`, border: `1px solid ${color}30`, color }}>
          {icons.shield(color, 14)} {label}
        </div>
      </div>
    </div>
  );
}

function RepoStats({ repo }) {
  const stats = [
    { icon: icons.star(), val: repo.stars, lbl: 'Stars' },
    { icon: icons.git(), val: repo.commits, lbl: 'Commits' },
    { icon: icons.issue(), val: repo.openIssues, lbl: 'Issues' },
    { icon: icons.code(), val: repo.language, lbl: 'Lang' },
    { icon: icons.fork(), val: repo.forks, lbl: 'Forks' },
  ];
  return (
    <div className="stats-panel panel">
      <span className="panel-label">REPO METRICS</span>
      <div style={{ marginTop: 8 }}>
        <div className="stats-title">{icons.terminal()} System Analysis</div>
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.lbl} className="stat-box">
              <div className="stat-icon-wrap">{s.icon}</div>
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThreatCard({ sev, count }) {
  const { color, bg, border } = C[sev];
  return (
    <div className="threat-card" style={{ background: bg, borderColor: border }}>
      <div className="threat-card" style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background: color, borderRadius: '3px 0 0 3px' }} />
      <div className="threat-icon-hex">
        <div style={{ position:'absolute' }}><HexFilled size={36} color={color} /></div>
        <div style={{ position:'relative', zIndex:1 }}>{icons.alert(color, 14)}</div>
      </div>
      <div>
        <div className="threat-count" style={{ color, textShadow: `0 0 12px ${color}` }}>{count}</div>
        <div className="threat-sev" style={{ color }}>{sev}</div>
      </div>
    </div>
  );
}

function VulnCard({ title, severity, file, id, index }) {
  const { color, bg, border } = C[severity];
  return (
    <div className="vuln-card" style={{ animationDelay: `${index * 0.07}s`, borderColor: border }}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background: color, borderRadius:'3px 0 0 3px' }} />
      <div className="vuln-hex">
        <div style={{ position:'absolute' }}><HexFilled size={40} color={color} /></div>
        <div style={{ position:'relative', zIndex:1 }}>{icons.bug(color, 16)}</div>
      </div>
      <div className="vuln-body">
        <div className="vuln-title">{title}</div>
        <div className="vuln-meta">
          <span className="vuln-file">{icons.terminal()} {file}</span>
          <span className="vuln-id">#{String(id).padStart(3,'0')}</span>
        </div>
      </div>
      <div className="vuln-badge" style={{ color, background: bg, border: `1px solid ${border}`, boxShadow: `0 0 8px ${C[severity].glow}` }}>
        {severity}
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function App() {
  const [score] = useState(61);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setLoadPct(p => { if(p>=100){clearInterval(interval);return 100;} return p+4; }), 60);
    setTimeout(() => setLoading(false), 1600);
    return () => clearInterval(interval);
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

  const counts = { Critical:2, High:2, Medium:2, Low:1 };
  const filtered = filter === 'All' ? vulnerabilities : vulnerabilities.filter(v => v.severity === filter);

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="app">
        <MatrixCanvas />
        <div className="scanlines" />
        <div className="loading-screen">
          <div className="loading-hex">{icons.shield('#00f5ff', 52)}</div>
          <div className="loading-text">Initializing Scan Engine</div>
          <div className="loading-bar-wrap"><div className="loading-bar" /></div>
          <div className="loading-pct" style={{ fontFamily:'Orbitron,monospace', fontSize:13, color:'#00f5ff', letterSpacing:3 }}>{loadPct}%</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <MatrixCanvas />
        <div className="scanlines" />
        <div className="corner-glow tl" /><div className="corner-glow br" /><div className="corner-glow tr" />

        <div className="main">
          {/* Header */}
          <header className="header">
            <div className="brand">
              <div className="hex-icon">
                <svg className="hex-bg" width="56" height="56" viewBox="0 0 56 56">
                  <polygon points="28,3 51,16 51,40 28,53 5,40 5,16" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="1" strokeDasharray="4 2"/>
                </svg>
                <svg className="hex-inner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" fill="rgba(0,245,255,0.08)"/>
                  <polyline points="9,12 11,14 15,10"/>
                </svg>
              </div>
              <div className="brand-text">
                <div className="brand-title">SecureScope</div>
                <div className="brand-sub">SivaBalan-ML / my-ai-project · v2.4.1</div>
              </div>
            </div>
            <div className="header-right">
              <div className="threat-bar">
                <div className="threat-bar-dots">
                  {[0,1,2,3].map(i=><div key={i} className="threat-dot" style={{animationDelay:`${i*0.2}s`}}/>)}
                </div>
                THREAT: MEDIUM
              </div>
              <button className="toggle-btn">{icons.eye()} {icons.wifi()}</button>
            </div>
          </header>

          {/* Score + Stats */}
          <div className="top-row">
            <ScoreRing score={score} />
            <RepoStats repo={repo} />
          </div>

          {/* Threat matrix */}
          <div className="threat-row">
            {Object.entries(counts).map(([sev,cnt]) => <ThreatCard key={sev} sev={sev} count={cnt} />)}
          </div>

          {/* Vuln section */}
          <div className="section-header">
            <div className="section-title">{icons.alert('#00f5ff', 16)} Vulnerability Matrix</div>
            <div className="section-line" />
            <div className="section-count">{filtered.length} / {vulnerabilities.length} entries</div>
          </div>

          <div className="filter-row">
            {['All', 'Critical', 'High', 'Medium', 'Low'].map(f => (
              <button key={f} className={`filter-btn ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
                {f!=='All' && <span style={{width:6,height:6,borderRadius:'50%',background:filter===f?'#00f5ff':C[f].color,display:'inline-block'}}/>}
                {f} [{f==='All'?vulnerabilities.length:counts[f]||0}]
              </button>
            ))}
          </div>

          <div className="vuln-list">
            {filtered.map((v,i) => <VulnCard key={v.id} {...v} index={i} />)}
          </div>

          {/* Footer */}
          <div className="footer">
            <div className="footer-left">
              {icons.shield('#00f5ff', 14)}
              <span>SECURESCOPE ENGINE · BUILD 2025.04</span>
            </div>
            <div className="footer-status">
              <div className="footer-dot" /> ALL SYSTEMS OPERATIONAL
            </div>
          </div>
        </div>
      </div>
    </>
  );
}