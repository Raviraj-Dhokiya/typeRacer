import { useState, useEffect } from 'react';
import { getTitleForLevel } from './utils/badgesList';

export default function LeaderboardPage({ onBack }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLeaders(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="profile-page">
      <button className="profile-back-btn" onClick={onBack}>
        ← Back to Test
      </button>

      <div className="profile-hero" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '24px' }}>
        <h1 className="profile-name">🌍 Global Leaderboard</h1>
        <p className="profile-email">Top Typists Ranked by Skill (XP & Level)</p>
      </div>

      <div className="profile-panel">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading rankings...</div>
        ) : leaders.length > 0 ? (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Level</th>
                  <th>XP</th>
                  <th>Badges Earned</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((user, i) => {
                  const title = getTitleForLevel(user.level || 1);
                  return (
                    <tr key={user._id}>
                      <td className="history-rank" style={{ fontSize: i < 3 ? '1.5rem' : '1rem' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-elevated)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '1px solid var(--border)' }}>
                            {user.avatar || user.username.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>{user.username}</span>
                        </div>
                      </td>
                      <td>
                        <span className="profile-level-badge" style={{ backgroundColor: title.color, color: '#000', fontSize: '0.7em', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          Lvl {user.level || 1} - {title.title}
                        </span>
                      </td>
                      <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{user.xp || 0}</td>
                      <td>{(user.badges || []).length} 🏅</td>
                      <td className="history-date">{new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
