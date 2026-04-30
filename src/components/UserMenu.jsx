import { useState, useRef, useEffect } from 'react'

export default function UserMenu({ user, onProfile, onLogout }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown when clicking anywhere outside the menu
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleProfile = () => {
    setOpen(false)
    onProfile()
  }

  const handleLogout = () => {
    setOpen(false)
    onLogout()
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-avatar-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="User menu"
        aria-expanded={open}
      >
        <div className="user-avatar">
          {user.avatar || user.username.charAt(0).toUpperCase()}
        </div>
        <span className="user-name-header">{user.username}</span>
        <span className="user-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-info">
            <div className="dropdown-avatar">
              {user.avatar || user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="dropdown-username">{user.username}</div>
              <div className="dropdown-email">{user.email}</div>
            </div>
          </div>

          <div className="user-dropdown-divider" />

          <button
            className="dropdown-item"
            role="menuitem"
            onMouseDown={handleProfile}
          >
            👤 My Profile
          </button>

          <button
            className="dropdown-item danger"
            role="menuitem"
            onMouseDown={handleLogout}
          >
            🚪 Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
