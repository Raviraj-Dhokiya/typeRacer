// In local dev: empty string → Vite proxy handles /api → localhost:5000
// In production: set VITE_API_URL to your Render backend URL in Vercel env vars
export const API_BASE = import.meta.env.VITE_API_URL || ''
