import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// Note: The anon key is safe to expose — Supabase RLS enforces row-level auth.
// Groq API key is exposed in the frontend (acceptable for a portfolio project).
// Production hardening: proxy Groq calls through an Express/serverless backend
// so the key is never shipped to the client.