// frontend/AuthModal.jsx
// Authentication modal — handles Login, Register, and OTP verification tabs

import { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

export default function AuthModal({ onClose }) {
  const { login, register, verifyOtp, resendOtp, otpPending, otpEmail, cancelOtp } = useAuth()

  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', otp: '' })
  const [error, setError] = useState('')
  const [infoMsg, setInfoMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Sync with Redux OTP state (e.g., triggered from login flow)
  useEffect(() => {
    if (otpPending) setTab('otp')
  }, [otpPending])

  // Countdown for resend OTP cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const handle = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
    setInfoMsg('')
  }

  const activeEmail = otpEmail || form.email

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    setLoading(true)
    const res = await resendOtp(activeEmail)
    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      setInfoMsg('New OTP sent to your email!')
      setResendCooldown(60) // 60-second cooldown
    }
  }

  const handleBack = () => {
    cancelOtp()
    setTab('login')
    setError('')
    setInfoMsg('')
    setForm((f) => ({ ...f, otp: '' }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setInfoMsg('')
    setLoading(true)

    if (tab === 'otp') {
      // ── OTP Verification ──
      if (!form.otp.trim() || form.otp.length !== 6) {
        setError('Enter a valid 6-digit OTP')
        setLoading(false)
        return
      }
      const res = await verifyOtp(activeEmail, form.otp.trim())
      if (res.error) { setError(res.error); setLoading(false); return }
      onClose()

    } else if (tab === 'login') {
      // ── Login ──
      const res = await login(form.email, form.password)
      if (res.requireOtp) {
        setTab('otp')
        setError(res.error || '')
        setLoading(false)
        return
      }
      if (res.error) { setError(res.error); setLoading(false); return }
      onClose()

    } else {
      // ── Register ──
      if (!form.username.trim()) { setError('Username is required'); setLoading(false); return }
      if (form.username.length < 3) { setError('Username must be at least 3 characters'); setLoading(false); return }
      if (!form.email.includes('@')) { setError('Enter a valid email'); setLoading(false); return }
      if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }
      if (form.password !== form.confirm) { setError('Passwords do not match'); setLoading(false); return }

      const res = await register(form.username.trim(), form.email.trim().toLowerCase(), form.password)
      if (res.requireOtp) {
        setTab('otp')
        setLoading(false)
        return
      }
      if (res.error) { setError(res.error); setLoading(false); return }
      onClose()
    }

    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Logo */}
        <div className="modal-logo">
          <div className="logo-icon" style={{ width: 44, height: 44, fontSize: 22 }}>⌨</div>
          <span className="logo-text" style={{ fontSize: 22 }}>TypeRacer</span>
        </div>

        {/* Tabs */}
        {tab !== 'otp' && (
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError(''); setInfoMsg('') }}
            >Sign In</button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setError(''); setInfoMsg('') }}
            >Create Account</button>
          </div>
        )}
        {tab === 'otp' && (
          <div className="auth-tabs">
            <button className="auth-tab active" style={{ cursor: 'default' }}>Verify Email</button>
          </div>
        )}

        <form onSubmit={submit} className="auth-form">
          {tab === 'otp' ? (
            <div className="form-group">
              <label className="form-label">Enter 6-digit OTP</label>
              <input
                className="form-input"
                name="otp"
                type="text"
                inputMode="numeric"
                placeholder="123456"
                value={form.otp}
                onChange={handle}
                maxLength={6}
                autoFocus
              />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                OTP was sent to <strong>{activeEmail}</strong>
              </p>

              {/* Resend OTP */}
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                </button>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>·</span>
                <button type="button" className="auth-switch-btn" onClick={handleBack}>
                  ← Back to Login
                </button>
              </div>
            </div>
          ) : (
            <>
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
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    className="form-input"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={tab === 'register' ? 'At least 6 characters' : '••••••••'}
                    value={form.password}
                    onChange={handle}
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    style={{ paddingRight: '44px', width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {tab === 'register' && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      className="form-input"
                      name="confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={form.confirm}
                      onChange={handle}
                      autoComplete="new-password"
                      style={{ paddingRight: '44px', width: '100%' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Info message (green) */}
          {infoMsg && (
            <div className="auth-info" style={{
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#4ade80',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '13px',
              marginBottom: '8px',
            }}>
              ✅ {infoMsg}
            </div>
          )}

          {/* Error message */}
          {error && <div className="auth-error">⚠ {error}</div>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              tab === 'login' ? '🔑 Sign In' : tab === 'register' ? '🚀 Create Account' : '✅ Verify OTP'
            )}
          </button>
        </form>

        {tab !== 'otp' && (
          <p className="auth-switch">
            {tab === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              className="auth-switch-btn"
              onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); setInfoMsg('') }}
            >
              {tab === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
