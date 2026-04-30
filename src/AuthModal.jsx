import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handle = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 300)) // small delay for UX

    if (tab === 'login') {
      const res = await login(form.email, form.password)
      if (res.error) { setError(res.error); setLoading(false); return }
      onClose()
    } else {
      if (!form.username.trim()) { setError('Username is required'); setLoading(false); return }
      if (form.username.length < 3) { setError('Username must be at least 3 characters'); setLoading(false); return }
      if (!form.email.includes('@')) { setError('Enter a valid email'); setLoading(false); return }
      if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }
      if (form.password !== form.confirm) { setError('Passwords do not match'); setLoading(false); return }
      const res = await register(form.username.trim(), form.email.trim().toLowerCase(), form.password)
      if (res.error) { setError(res.error); setLoading(false); return }
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Logo */}
        <div className="modal-logo">
          <div className="logo-icon" style={{ width: 44, height: 44, fontSize: 22 }}>⌨</div>
          <span className="logo-text" style={{ fontSize: 22 }}>TypeRacer</span>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError('') }}
          >Sign In</button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError('') }}
          >Create Account</button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                name="username"
                type="text"
                placeholder="e.g. speedtyper99"
                value={form.username}
                onChange={handle}
                autoComplete="username"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handle}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              placeholder={tab === 'register' ? 'At least 6 characters' : '••••••••'}
              value={form.password}
              onChange={handle}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                name="confirm"
                type="password"
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={handle}
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="auth-error">⚠ {error}</div>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              tab === 'login' ? '🔑 Sign In' : '🚀 Create Account'
            )}
          </button>
        </form>

        <p className="auth-switch">
          {tab === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className="auth-switch-btn"
            onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}
          >
            {tab === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
