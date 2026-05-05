// frontend/store/authSlice.js
// Redux slice for authentication state management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE } from '../utils/api';

// ── Async Thunks ─────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Registration failed');
      return data; // { message, requireOtp, email }
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue({ error: data.error, requireOtp: data.requireOtp, email: data.email });
      return data; // { token, user }
    } catch {
      return rejectWithValue({ error: 'Network error. Please try again.' });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Verification failed');
      return data; // { token, user }
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Failed to resend OTP');
      return data; // { message, email }
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

// ── Helper: persist session to localStorage ──────────────────────────
const persistSession = (token, user) => {
  localStorage.setItem('typeracer_token', token);
  localStorage.setItem('typeracer_user', JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem('typeracer_token');
  localStorage.removeItem('typeracer_user');
};

const loadSession = () => {
  try {
    const token = localStorage.getItem('typeracer_token');
    const user = JSON.parse(localStorage.getItem('typeracer_user') || 'null');
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

// ── Initial State ─────────────────────────────────────────────────────
const { token: savedToken, user: savedUser } = loadSession();

const initialState = {
  user: savedUser,
  token: savedToken,
  loading: false,
  error: null,
  // OTP flow state
  otpPending: false,
  otpEmail: null,
};

// ── Slice ─────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.otpPending = false;
      state.otpEmail = null;
      clearSession();
    },
    clearAuthError(state) {
      state.error = null;
    },
    // Called by UI when navigating away from OTP screen
    cancelOtp(state) {
      state.otpPending = false;
      state.otpEmail = null;
      state.error = null;
    },
    updateUserData(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('typeracer_user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requireOtp) {
          state.otpPending = true;
          state.otpEmail = action.payload.email;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        persistSession(action.payload.token, action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload?.requireOtp) {
          state.otpPending = true;
          state.otpEmail = payload.email;
          state.error = payload.error; // "Please verify your email first..."
        } else {
          state.error = payload?.error || payload || 'Login failed';
        }
      });

    // ── Verify OTP ──
    builder
      .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.otpPending = false;
        state.otpEmail = null;
        persistSession(action.payload.token, action.payload.user);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Resend OTP ──
    builder
      .addCase(resendOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(resendOtp.fulfilled, (state) => { state.loading = false; })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError, cancelOtp, updateUserData } = authSlice.actions;
export default authSlice.reducer;
