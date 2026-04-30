import { useState } from 'react'
import { useAuth } from './AuthContext'

function StatBox({ label, value, color }) {
  return (
    <div className="profile-stat-box">
      <div className="profile-stat-val" style={{ color }}>{value}</div>
      <div className="profile-stat-lbl">{label}</div>
    </div>
  )
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function ProfilePage({ onBack }) {
  const { user, getResults, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('stats')
  const results = getResults()

  // Aggregate stats
  const totalTests = results.length
  const avgWPM = totalTests
    ? Math.round(results.reduce((s, r) => s + r.wpm, 0) / totalTests)
    : 0
  const bestWPM = totalTests ? Math.max(...results.map(r => r.wpm)) : 0
  const avgAcc = totalTests
    ? Math.round(results.reduce((s, r) => s + r.accuracy, 0) / totalTests)
    : 0

  // WPM trend for sparkline (last 10)
  const recent = [...results].slice(0, 10).reverse()
  const maxWPM = recent.length ? Math.max(...recent.map(r => r.wpm), 1) : 1

  const handleLogout = () => {
    logout()
    onBack()
  }

  return (
    <div className="profile-page">
      {/* Back button */}
      <button className="profile-back-btn" onClick={onBack}>
        ← Back to Test
      </button>

      {/* Profile Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">
          {user.avatar || user.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-hero-info">
          <h1 className="profile-name">{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-joined">
            Member since {new Date(user.createdAt).toLocaleDateString('en-IN', {
              month: 'long', year: 'numeric'
            })}
          </p>
        </div>
        <button className="btn btn-ghost profile-logout-btn" onClick={handleLogout}>
          🚪 Sign Out
        </button>
      </div>

      {/* Stats Overview */}
      <div className="profile-stats-grid">
        <StatBox label="Tests Taken" value={totalTests} color="var(--accent-light)" />
        <StatBox label="Best WPM" value={bestWPM} color="#f59e0b" />
        <StatBox label="Avg WPM" value={avgWPM} color="var(--accent-light)" />
        <StatBox label="Avg Accuracy" value={`${avgAcc}%`} color="var(--correct)" />
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {['stats', 'history'].map(t => (
          <button
            key={t}
            className={`profile-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'stats' ? '📊 Performance' : '📋 History'}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        <div className="profile-panel">
          {recent.length > 0 ? (
            <>
              <h3 className="panel-title">WPM Trend (last {recent.length} tests)</h3>
              {/* Sparkline chart */}
              <div className="sparkline-wrap">
                {recent.map((r, i) => (
                  <div key={r.id} className="spark-col">
                    <div className="spark-bar-wrap">
                      <div
                        className="spark-bar"
                        style={{ height: `${Math.round((r.wpm / maxWPM) * 100)}%` }}
                        title={`${r.wpm} WPM`}
                      />
                    </div>
                    <div className="spark-label">{r.wpm}</div>
                  </div>
                ))}
              </div>

              {/* Mode breakdown */}
              <h3 className="panel-title" style={{ marginTop: 32 }}>Mode Breakdown</h3>
              <div className="mode-breakdown">
                {['common', 'code', 'quotes'].map(m => {
                  const modeResults = results.filter(r => r.mode === m)
                  const modeAvg = modeResults.length
                    ? Math.round(modeResults.reduce((s, r) => s + r.wpm, 0) / modeResults.length)
                    : null
                  return (
                    <div key={m} className="mode-breakdown-row">
                      <div className="mode-breakdown-name">
                        {m === 'common' ? '📝 Common Words' : m === 'code' ? '💻 Code' : '💬 Quotes'}
                      </div>
                      <div className="mode-breakdown-bar-wrap">
                        <div
                          className="mode-breakdown-bar"
                          style={{ width: modeAvg ? `${Math.round((modeAvg / (bestWPM || 1)) * 100)}%` : '0%' }}
                        />
                      </div>
                      <div className="mode-breakdown-val">
                        {modeAvg !== null ? `${modeAvg} WPM` : '—'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="profile-empty">
              <div className="profile-empty-icon">⌨️</div>
              <p>No tests yet. Start typing to see your stats!</p>
              <button className="btn btn-primary" onClick={onBack}>Take a Test</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="profile-panel">
          {results.length > 0 ? (
            <div className="history-table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>WPM</th>
                    <th>Accuracy</th>
                    <th>Time</th>
                    <th>Mode</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.id}>
                      <td className="history-rank">{i + 1}</td>
                      <td className="history-wpm">{r.wpm}</td>
                      <td className="history-acc">{r.accuracy}%</td>
                      <td>{r.timeTaken}s</td>
                      <td>
                        <span className="history-mode-badge">
                          {r.mode === 'common' ? 'Words' : r.mode === 'code' ? 'Code' : 'Quote'}
                        </span>
                      </td>
                      <td className="history-date">{formatDate(r.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="profile-empty">
              <div className="profile-empty-icon">📋</div>
              <p>No history yet. Complete a test to track your progress!</p>
              <button className="btn btn-primary" onClick={onBack}>Take a Test</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
