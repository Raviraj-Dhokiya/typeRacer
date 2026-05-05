// frontend/store/resultsSlice.js
// Redux slice for typing test results state management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE } from '../utils/api';

// ── Async Thunks ─────────────────────────────────────────────────────

export const fetchResults = createAsyncThunk(
  'results/fetch',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const res = await fetch(`${API_BASE}/api/results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Failed to fetch results');
      return data; // array of results
    } catch {
      return rejectWithValue('Network error');
    }
  }
);

export const saveResult = createAsyncThunk(
  'results/save',
  async (result, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const res = await fetch(`${API_BASE}/api/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Failed to save result');
      return data; // { result, newBadges, userUpdate }
    } catch {
      return rejectWithValue('Network error');
    }
  }
);

// ── Initial State ─────────────────────────────────────────────────────
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────
const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    clearResults(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch ──
    builder
      .addCase(fetchResults.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Save ──
    builder
      .addCase(saveResult.pending, (state) => { state.loading = true; })
      .addCase(saveResult.fulfilled, (state, action) => {
        state.loading = false;
        // Prepend the new result, keep max 50
        state.items = [action.payload.result, ...state.items].slice(0, 50);
      })
      .addCase(saveResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Failed to save result:', action.payload);
      });
  },
});

export const { clearResults } = resultsSlice.actions;
export default resultsSlice.reducer;
