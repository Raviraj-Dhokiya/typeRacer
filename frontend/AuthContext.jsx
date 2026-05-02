import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { BADGES_DATA } from './utils/badgesList'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [results, setResults] = useState([])

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('typeracer_user')
    const storedToken = localStorage.getItem('typeracer_token')
    if (storedUser && storedToken) {
      try { 
        setUser(JSON.parse(storedUser)) 
        setToken(storedToken)
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchResults()
    } else {
      setResults([])
    }
  }, [token])

  const register = async (username, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error || 'Registration failed' }
      
      if (data.requireOtp) {
        toast.success('OTP sent to your email!')
        return { success: true, requireOtp: true, email: data.email }
      }
      
      localStorage.setItem('typeracer_token', data.token)
      localStorage.setItem('typeracer_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      toast.success('Account created successfully!')
      return { success: true }
    } catch (err) {
      return { error: 'Network error' }
    }
  }

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.requireOtp) {
          toast.success('A new OTP has been sent to your email!')
          return { error: data.error, requireOtp: true, email: data.email }
        }
        return { error: data.error || 'Login failed' }
      }
      
      localStorage.setItem('typeracer_token', data.token)
      localStorage.setItem('typeracer_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      toast.success('Successfully logged in!')
      return { success: true }
    } catch (err) {
      return { error: 'Network error' }
    }
  }

  const logout = () => {
    localStorage.removeItem('typeracer_token')
    localStorage.removeItem('typeracer_user')
    setToken(null)
    setUser(null)
    setResults([])
    toast.success('Logged out successfully!')
  }

  const saveResult = async (result) => {
    if (!token) return
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(result)
      })
      const data = await res.json()
      if (res.ok) {
        setResults(prev => [data.result, ...prev].slice(0, 50))
        if (data.userUpdate) {
          const updatedUser = { ...user, ...data.userUpdate };
          setUser(updatedUser);
          localStorage.setItem('typeracer_user', JSON.stringify(updatedUser));
        }
        if (data.newBadges && data.newBadges.length > 0) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
          data.newBadges.forEach(badgeId => {
            const badge = BADGES_DATA[badgeId];
            if (badge) {
              toast(`Badge Earned: ${badge.name}`, {
                icon: badge.icon,
                duration: 5000,
                style: {
                  borderRadius: '10px',
                  background: 'var(--bg-lighter)',
                  color: 'var(--text)',
                  border: '1px solid var(--primary)'
                },
              });
            }
          });
        }
      }
    } catch (err) {
      console.error('Failed to save result', err)
    }
  }

  const fetchResults = async () => {
    if (!token) return
    try {
      const res = await fetch('/api/results', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setResults(data)
      }
    } catch (err) {
      console.error('Failed to fetch results', err)
    }
  }

  const getResults = () => {
    return results
  }

  const verifyOtp = async (email, otp) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error || 'Verification failed' }
      
      localStorage.setItem('typeracer_token', data.token)
      localStorage.setItem('typeracer_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      toast.success('Email verified successfully!')
      return { success: true }
    } catch (err) {
      return { error: 'Network error' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, saveResult, getResults, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

