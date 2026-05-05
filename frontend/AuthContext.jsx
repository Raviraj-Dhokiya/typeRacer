// frontend/AuthContext.jsx
// AuthContext now acts as a thin bridge between Redux store and components.
// All auth state lives in Redux (store/authSlice.js).
// Components that need auth actions import from here via useAuth().

import { createContext, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

import {
  loginUser,
  registerUser,
  verifyOtp,
  resendOtp as resendOtpThunk,
  logout as logoutAction,
  clearAuthError,
  cancelOtp,
  updateUserData,
} from './store/authSlice'
import { saveResult as saveResultThunk, fetchResults, clearResults } from './store/resultsSlice'
import { BADGES_DATA } from './utils/badgesList'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const { user, token, loading, error, otpPending, otpEmail } = useSelector((s) => s.auth)
  const results = useSelector((s) => s.results.items)

  // Fetch results whenever user logs in
  useEffect(() => {
    if (token) {
      dispatch(fetchResults())
    } else {
      dispatch(clearResults())
    }
  }, [token, dispatch])

  // ── register ────────────────────────────────────────────────────────
  const register = async (username, email, password) => {
    const action = await dispatch(registerUser({ username, email, password }))
    if (registerUser.fulfilled.match(action)) {
      toast.success('OTP sent to your email!')
      return { success: true, requireOtp: action.payload.requireOtp, email: action.payload.email }
    }
    return { error: action.payload }
  }

  // ── login ────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const action = await dispatch(loginUser({ email, password }))
    if (loginUser.fulfilled.match(action)) {
      toast.success('Successfully logged in!')
      return { success: true }
    }
    const payload = action.payload
    if (payload?.requireOtp) {
      toast.success('A new OTP has been sent to your email!')
      return { requireOtp: true, email: payload.email, error: payload.error }
    }
    return { error: payload?.error || payload || 'Login failed' }
  }

  // ── logout ───────────────────────────────────────────────────────────
  const logout = () => {
    dispatch(logoutAction())
    toast.success('Logged out successfully!')
  }

  // ── verifyOtp ────────────────────────────────────────────────────────
  const verifyOtpFn = async (email, otp) => {
    const action = await dispatch(verifyOtp({ email, otp }))
    if (verifyOtp.fulfilled.match(action)) {
      toast.success('Email verified successfully!')
      return { success: true }
    }
    return { error: action.payload }
  }

  // ── resendOtp ────────────────────────────────────────────────────────
  const resendOtp = async (email) => {
    const action = await dispatch(resendOtpThunk({ email }))
    if (resendOtpThunk.fulfilled.match(action)) {
      toast.success('New OTP sent to your email!')
      return { success: true }
    }
    return { error: action.payload }
  }

  // ── saveResult ───────────────────────────────────────────────────────
  const saveResultFn = async (result) => {
    if (!token) return
    const action = await dispatch(saveResultThunk(result))
    if (saveResultThunk.fulfilled.match(action)) {
      const { newBadges, userUpdate } = action.payload
      if (userUpdate) dispatch(updateUserData(userUpdate))
      if (newBadges?.length > 0) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
        newBadges.forEach((badgeId) => {
          const badge = BADGES_DATA[badgeId]
          if (badge) {
            toast(`Badge Earned: ${badge.name}`, {
              icon: badge.icon,
              duration: 5000,
              style: {
                borderRadius: '10px',
                background: 'var(--bg-lighter)',
                color: 'var(--text)',
                border: '1px solid var(--primary)',
              },
            })
          }
        })
      }
    }
  }

  const getResults = () => results

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        otpPending,
        otpEmail,
        register,
        login,
        logout,
        verifyOtp: verifyOtpFn,
        resendOtp,
        saveResult: saveResultFn,
        getResults,
        clearError: () => dispatch(clearAuthError()),
        cancelOtp: () => dispatch(cancelOtp()),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
