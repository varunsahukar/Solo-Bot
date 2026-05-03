import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
    // Return a dummy client or handle it in the UI
  }
  return createBrowserClient(supabaseUrl || '', supabaseKey || '')
}

