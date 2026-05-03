import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'
import { checkSupabaseConfig } from '../utils/supabase/middleware'

type Todo = {
  id: string | number
  name: string
}

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadTodos = async () => {
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { data, error: queryError } = await supabase.from('todos').select('id,name').order('id', { ascending: false })
    if (queryError) {
      setError(queryError.message)
      setLoading(false)
      return
    }
    setTodos((data as Todo[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadTodos().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    })
  }, [])

  const onCreate = async () => {
    if (!newTodo.trim() || saving) return
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: insertError } = await supabase.from('todos').insert({ name: newTodo.trim() })
      if (insertError) {
        setError(insertError.message)
      } else {
        setNewTodo('')
        await loadTodos()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  const config = checkSupabaseConfig()

  return (
    <div className='mx-auto max-w-4xl p-8'>
      <h2 className='display-type mb-3 text-4xl text-white'>Supabase Todos</h2>
      <p className='mb-6 text-sm text-slate-400'>
        Runtime config: {config.ok ? 'connected vars found' : 'missing env vars'} (
        {config.urlSet ? 'url' : 'no-url'} / {config.keySet ? 'key' : 'no-key'})
      </p>

      <div className='mb-4 flex gap-2'>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder='Add new todo'
          className='flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white'
        />
        <button
          onClick={onCreate}
          disabled={!newTodo.trim() || saving}
          className='rounded-xl border border-white/20 bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50'
        >
          {saving ? 'Adding...' : 'Add'}
        </button>
      </div>

      {error ? <p className='mb-4 text-sm text-red-300'>Supabase error: {error}</p> : null}

      <div className='rounded-2xl border border-white/10 bg-black/40 p-4'>
        {loading ? (
          <p className='text-sm text-slate-400'>Loading todos...</p>
        ) : todos.length === 0 ? (
          <p className='text-sm text-slate-400'>No todos found.</p>
        ) : (
          <ul className='space-y-2'>
            {todos.map((todo) => (
              <li key={todo.id} className='rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white'>
                {todo.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
