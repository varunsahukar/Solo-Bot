import { useEffect, useState } from 'react'
import { db } from './useIndexedDB'

type Theme = 'light' | 'dark' | 'system'

export function usePreferences() {
  const [theme, setThemeState] = useState<Theme>('system')
  useEffect(() => { db.prefs.get('theme').then((r) => r?.value && applyTheme(r.value as Theme)) }, [])
  const applyTheme = (t: Theme) => { setThemeState(t); const d = document.documentElement; if (t === 'dark') d.classList.add('dark'); else if (t === 'light') d.classList.remove('dark'); else window.matchMedia('(prefers-color-scheme: dark)').matches ? d.classList.add('dark') : d.classList.remove('dark') }
  const setTheme = async (t: Theme) => { await db.prefs.put({ key: 'theme', value: t }); applyTheme(t) }
  return { theme, setTheme }
}
