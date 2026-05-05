import { useState, useEffect, useRef, useCallback } from 'react'
import { Toaster } from 'react-hot-toast'
import './App.css'

import { useAuth }       from './AuthContext'
import AuthModal         from './AuthModal'
import ProfilePage       from './ProfilePage'
import LeaderboardPage   from './LeaderboardPage'
import StatCard          from './components/StatCard'
import TextDisplay       from './components/TextDisplay'
import ResultsPanel      from './components/ResultsPanel'
import UserMenu          from './components/UserMenu'
import { generateText, calcWPM, calcAccuracy } from './utils/textUtils'

/* ── Constants ─────────────────────────────────────────── */
const TIMER_OPTIONS = [15, 30, 60, 120]
const MODE_OPTIONS  = [
  { key: 'paragraph', label: 'Paragraph' },
  { key: 'code',   label: 'Code'         },
  { key: 'quotes', label: 'Quotes'       },
]

/* ── App ────────────────────────────────────────────────── */
export default function App() {
  const { user, logout, saveResult } = useAuth()
  // Note: user, logout, saveResult all come from Redux via AuthContext bridge

  /* View */
  const [view,     setView]     = useState('test') // 'test' | 'profile'
  const [showAuth, setShowAuth] = useState(false)

  /* Test state */
  const [mode,      setMode]      = useState('paragraph')
  const [timeLimit, setTimeLimit] = useState(30)
  const [text,      setText]      = useState(() => generateText('paragraph'))
  const [typed,     setTyped]     = useState('')
  const [started,   setStarted]   = useState(false)
  const [finished,  setFinished]  = useState(false)
  const [timeLeft,  setTimeLeft]  = useState(30)
  const [timeTaken, setTimeTaken] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [liveWPM,   setLiveWPM]   = useState(0)
  const [liveAcc,   setLiveAcc]   = useState(100)
  const [finalWPM,  setFinalWPM]  = useState(0)
  const [finalAcc,  setFinalAcc]  = useState(100)
  const [resultSaved, setResultSaved] = useState(false)

  const inputRef     = useRef(null)
  const timerRef     = useRef(null)
  const startTimeRef = useRef(null)

  const progress   = (typed.length / text.length) * 100
  const errorCount = typed.split('').filter((c, i) => c !== text[i]).length

  /* Focus helper */
  const focusInput = useCallback(() => inputRef.current?.focus(), [])

  /* ── Reset ── */
  const reset = useCallback(() => {
    clearInterval(timerRef.current)
    startTimeRef.current = null
    setText(generateText(mode, (mode === 'quotes' || mode === 'paragraph') ? undefined : 60))
    setTyped('')
    setStarted(false)
    setFinished(false)
    setTimeLeft(timeLimit)
    setTimeTaken(0)
    setLiveWPM(0)
    setLiveAcc(100)
    setResultSaved(false)
    setTimeout(focusInput, 50)
  }, [mode, timeLimit, focusInput])

  useEffect(() => { reset() }, [mode, timeLimit]) // eslint-disable-line

  /* ── Timer ── */
  useEffect(() => {
    if (!started || finished) return
    timerRef.current = setInterval(() => {
      const elapsed   = (Date.now() - startTimeRef.current) / 1000
      const remaining = Math.max(0, timeLimit - elapsed)
      setTimeLeft(Math.ceil(remaining))
      const correctChars = typed.split('').filter((c, i) => c === text[i]).length
      setLiveWPM(calcWPM(correctChars, elapsed))
      setLiveAcc(calcAccuracy(typed, text))
      if (remaining <= 0) { clearInterval(timerRef.current); finishTest(elapsed) }
    }, 100)
    return () => clearInterval(timerRef.current)
  }, [started, finished, typed, text, timeLimit]) // eslint-disable-line

  /* ── Finish ── */
  const finishTest = useCallback((elapsed) => {
    clearInterval(timerRef.current)
    const secs         = Math.round(elapsed || (Date.now() - startTimeRef.current) / 1000)
    const correctChars = typed.split('').filter((c, i) => c === text[i]).length
    const wpm = calcWPM(correctChars, secs)
    const acc = calcAccuracy(typed, text)
    
    setFinalWPM(wpm)
    setFinalAcc(acc)
    setTimeTaken(secs)
    setFinished(true)
    setStarted(false)

    if (user) {
      saveResult({ wpm, accuracy: acc, timeTaken: secs, mode })
      setResultSaved(true)
    }
  }, [typed, text, user, saveResult, mode])

  /* ── Typing ── */
  const handleInput = useCallback((e) => {
    if (finished) return
    const value = e.target.value
    if (!started && value.length > 0) {
      setStarted(true)
      startTimeRef.current = Date.now()
    }
    setTyped(value)
    if (value.length >= text.length) {
      finishTest((Date.now() - startTimeRef.current) / 1000)
    }
  }, [finished, started, text, finishTest])

  /* ── Tab = restart ── */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Tab') { e.preventDefault(); reset() } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [reset])

  /* ── Auto focus ── */
  useEffect(() => { focusInput() }, [focusInput])

  /* ── Views ── */
  if (view === 'profile') return <ProfilePage onBack={() => setView('test')} />
  if (view === 'leaderboard') return <LeaderboardPage onBack={() => setView('test')} />

  /* ── New text helper ── */
  const loadNewText = () => {
    setText(generateText(mode, (mode === 'quotes' || mode === 'paragraph') ? undefined : 60))
    setTyped('')
    setStarted(false)
    clearInterval(timerRef.current)
    startTimeRef.current = null
    setTimeLeft(timeLimit)
    setLiveWPM(0)
    setLiveAcc(100)
    setTimeout(focusInput, 50)
  }

  return (
    <div className="app">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* ── Header ── */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">⌨</div>
          <span className="logo-text">TypeRacer</span>
        </div>

        <div className="header-right">
          <span className="header-badge">Speed Test</span>

          {user ? (
            <UserMenu
              user={user}
              onProfile={() => setView('profile')}
              onLogout={logout}
            />
          ) : (
            <div className="auth-buttons">
              <button id="signin-btn" className="btn btn-ghost btn-sm" onClick={() => setShowAuth(true)}>
                Sign In
              </button>
              <button id="signup-btn" className="btn btn-primary btn-sm" onClick={() => setShowAuth(true)}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main">

        {/* ── Mode / Timer selector ── */}
        <div className="mode-selector" role="group" aria-label="Test mode">
          {MODE_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              id={`mode-${key}`}
              className={`mode-btn ${mode === key ? 'active' : ''}`}
              onClick={() => setMode(key)}
              aria-pressed={mode === key}
            >
              {label}
            </button>
          ))}
          <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
          {TIMER_OPTIONS.map(t => (
            <button
              key={t}
              id={`timer-${t}`}
              className={`mode-btn ${timeLimit === t ? 'active' : ''}`}
              onClick={() => setTimeLimit(t)}
              aria-pressed={timeLimit === t}
            >
              {t}s
            </button>
          ))}
        </div>

        {/* ── Live Stats Bar ── */}
        <div className="stats-bar" role="region" aria-label="Live statistics">
          <StatCard label="WPM"      value={started ? liveWPM : '—'}             cls="wpm"    unit="words/min" />
          <StatCard label="Accuracy" value={started ? `${liveAcc}%` : '—'}       cls="acc"    unit="correct"   />
          <StatCard label="Time"     value={started || !finished ? timeLeft : '—'} cls="timer" unit="seconds"  />
          <StatCard label="Errors"   value={started ? errorCount : '—'}           cls="errors" unit="mistakes"  />
        </div>

        {/* ── Typing Area or Results ── */}
        {finished ? (
          <ResultsPanel
            wpm={finalWPM}
            accuracy={finalAcc}
            timeTaken={timeTaken}
            mode={mode}
            onRestart={reset}
          />
        ) : (
          <div
            id="typing-area"
            className={`typing-section ${isFocused ? 'focused' : ''}`}
            onClick={focusInput}
            aria-label="Typing area"
          >
            {/* Focus overlay */}
            {!isFocused && (
              <div className="focus-hint" onClick={focusInput} aria-hidden="true">
                <div className="focus-hint-inner">
                  <div className="focus-hint-icon">⌨️</div>
                  <div className="focus-hint-text">Click here or press any key to start</div>
                  <div className="focus-hint-key">Click to focus</div>
                </div>
              </div>
            )}

            {/* Hidden input */}
            <input
              ref={inputRef}
              id="typing-input"
              className="hidden-input"
              value={typed}
              onChange={handleInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              aria-label="Type here"
              aria-hidden="true"
            />

            {/* Text display */}
            <TextDisplay text={text} typed={typed} isActive={isFocused} />

            {/* Progress bar */}
            <div className="progress-bar-wrap" aria-hidden="true">
              <div className="progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          </div>
        )}

        {/* ── Controls ── */}
        {!finished && (
          <div className="controls">
            <button id="restart-main-btn" className="btn btn-primary" onClick={reset}>
              <span>↺</span> Restart
            </button>
            <button id="new-text-btn" className="btn btn-ghost" onClick={loadNewText}>
              New Text
            </button>
            <button id="leaderboard-btn" className="btn btn-ghost" onClick={() => setView('leaderboard')}>
              🌍 Leaderboard
            </button>
            {user && (
              <button id="profile-btn" className="btn btn-ghost" onClick={() => setView('profile')}>
                👤 Profile
              </button>
            )}
          </div>
        )}

        {/* ── Keyboard hint ── */}
        <div className="keyboard-hint" aria-label="Keyboard shortcut">
          Press <span className="key-badge">Tab</span> to restart anytime
          {!user && (
            <span style={{ marginLeft: 12 }}>
              · <button className="hint-link" onClick={() => setShowAuth(true)}>Sign in</button> to save results
            </span>
          )}
        </div>
      </main>

      <footer className="footer">
        TypeRacer — Built with React &amp; Vite · {new Date().getFullYear()}
      </footer>

      {/* ── Auth Modal ── */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
