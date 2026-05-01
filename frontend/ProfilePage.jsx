import { useState } from 'react'
import { useAuth } from './AuthContext'
import { BADGES_DATA, getTitleForLevel, getXPProgress } from './utils/badgesList'

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
  const [badgeFilter, setBadgeFilter] = useState('All') // 'All', 'Earned', 'Locked'
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
          <h1 className="profile-name">
            {user.username} 
            <span className="profile-level-badge" style={{ backgroundColor: getTitleForLevel(user.level || 1).color, color: '#000', fontSize: '0.5em', padding: '4px 8px', borderRadius: '12px', marginLeft: '10px', verticalAlign: 'middle' }}>
              Lvl {user.level || 1} - {getTitleForLevel(user.level || 1).title}
            </span>
          </h1>
          <p className="profile-email">{user.email}</p>
          <div className="xp-bar-container" style={{ width: '100%', maxWidth: '300px', backgroundColor: 'var(--bg-lighter)', height: '8px', borderRadius: '4px', marginTop: '8px', overflow: 'hidden' }}>
            <div className="xp-bar-fill" style={{ width: `${getXPProgress(user.xp).progress}%`, backgroundColor: 'var(--primary)', height: '100%' }}></div>
          </div>
          <p className="profile-joined" style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {user.xp || 0} / {getXPProgress(user.xp).nextLevelXp} XP • Member since {new Date(user.createdAt).toLocaleDateString('en-IN', {
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
        {['stats', 'history', 'badges'].map(t => (
          <button
            key={t}
            className={`profile-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'stats' ? '📊 Performance' : t === 'history' ? '📋 History' : '🏅 Badges'}
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

      {activeTab === 'badges' && (
        <div className="profile-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            {(() => {
              const validEarnedCount = (user.badges || []).filter(id => BADGES_DATA[id]).length;
              return <h3 className="panel-title" style={{ margin: 0 }}>Your Badges ({validEarnedCount} Earned)</h3>;
            })()}
            <div className="badge-filters" style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg)', padding: '6px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {['All', 'Earned', 'Locked'].map(f => (
                <button
                  key={f}
                  onClick={() => setBadgeFilter(f)}
                  style={{
                    background: badgeFilter === f ? '#10b981' : 'transparent',
                    color: badgeFilter === f ? '#ffffff' : 'var(--text)',
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: badgeFilter === f ? 'bold' : '500',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    opacity: badgeFilter === f ? 1 : 0.7
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const allBadges = Object.values(BADGES_DATA);
            const filteredBadges = allBadges.filter(badge => {
              const isEarned = user.badges?.includes(badge.id);
              if (badgeFilter === 'Earned') return isEarned;
              if (badgeFilter === 'Locked') return !isEarned;
              return true;
            });

            const difficulties = ['Easy', 'Medium', 'Hard', 'Legendary'];
            const diffColors = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444', Legendary: '#a855f7' };

            if (filteredBadges.length === 0) {
              return (
                <div className="profile-empty" style={{ marginTop: '40px' }}>
                  <div className="profile-empty-icon">🏅</div>
                  <p>No badges found for this filter.</p>
                </div>
              );
            }

            return difficulties.map(diff => {
              const badgesInDiff = filteredBadges.filter(b => b.difficulty === diff);
              if (badgesInDiff.length === 0) return null;

              return (
                <div key={diff} style={{ marginBottom: '40px' }}>
                  <h4 style={{ 
                    color: diffColors[diff], 
                    borderBottom: `2px solid ${diffColors[diff]}`, 
                    paddingBottom: '8px', 
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {diff} Tier
                  </h4>
                  <div className="badges-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {badgesInDiff.map(badge => {
                      const isEarned = user.badges?.includes(badge.id);
                      return (
                        <div key={badge.id} className={`badge-card ${isEarned ? 'earned' : 'locked'}`} style={{
                          padding: '16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-lighter)',
                          border: isEarned ? '2px solid var(--primary)' : '2px dashed var(--border)',
                          opacity: isEarned ? 1 : 0.5,
                          textAlign: 'center',
                          transition: 'all 0.3s ease'
                        }}>
                          <div className="badge-icon" style={{ fontSize: '2.5rem', marginBottom: '8px', filter: isEarned ? 'none' : 'grayscale(100%)' }}>
                            {badge.icon}
                          </div>
                          <div className="badge-name" style={{ fontWeight: 'bold', marginBottom: '4px', color: isEarned ? 'var(--text)' : 'var(--text-muted)' }}>
                            {badge.name}
                          </div>
                          <div className="badge-desc" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {badge.description}
                          </div>
                          <div className="badge-category" style={{ fontSize: '0.75rem', marginTop: '8px', color: diffColors[badge.difficulty], fontWeight: '800', textTransform: 'uppercase' }}>
                            {badge.category}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  )
}
