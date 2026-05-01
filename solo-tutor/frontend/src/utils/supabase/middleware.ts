export type SupabaseConfigCheck = {
  ok: boolean
  urlSet: boolean
  keySet: boolean
}

// In Next.js this would refresh auth session cookies in middleware.
// For this Vite app, we expose a small runtime config check instead.
export const checkSupabaseConfig = (): SupabaseConfigCheck => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  const urlSet = Boolean(url)
  const keySet = Boolean(key)
  return { ok: urlSet && keySet, urlSet, keySet }
}
