import { createContext, useContext, useState, useEffect } from 'react'

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
      
      localStorage.setItem('typeracer_token', data.token)
      localStorage.setItem('typeracer_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
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
      if (!res.ok) return { error: data.error || 'Login failed' }
      
      localStorage.setItem('typeracer_token', data.token)
      localStorage.setItem('typeracer_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
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
        setResults(prev => [data, ...prev].slice(0, 50))
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

  return (
    <AuthContext.Provider value={{ user, register, login, logout, saveResult, getResults }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

