import { createClient } from '@supabase/supabase-js'

// Hardcoded for static export - these are public anon keys, safe to expose
const SUPABASE_URL = 'https://uytqxlbymowzaagmvznl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHF4bGJ5bW93emFhZ212em5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDUyMTQsImV4cCI6MjA3OTMyMTIxNH0.KPqXbQ9QlDn83_wv2EUiHjpk7aYs1hVEeKcYzZoBK4k'

// Use env vars if available (build time), otherwise use hardcoded values (runtime)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY

// Supabase client for public access (using anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase client for server-side operations (using service key)
// In static export, this only runs at build time
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
