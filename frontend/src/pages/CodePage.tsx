import { useState } from 'react'
import { askCode } from '../api/code'
import { useActiveDoc } from '../store/activeDoc'

export default function CodePage() {
  const { docId } = useActiveDoc()
  const [q, setQ] = useState('')
  const [ans, setAns] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!q.trim() || loading) return
    setLoading(true)
    try { const r = await askCode(q, docId ?? ''); setAns(r.data.answer) }
    catch { setAns('Backend error.') }
    finally { setLoading(false) }
  }

  return (
    <div className='mx-auto max-w-4xl p-8'>
      <h2 className='mb-4 text-2xl font-semibold tracking-wide text-white'>Code Assistant</h2>
      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className='h-32 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-white/35'
      />
      <button
        onClick={submit}
        disabled={loading || !q.trim()}
        className='mt-2 rounded-xl border border-white/20 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:opacity-60'
      >
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      <pre className='mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-slate-200'>{ans}</pre>
    </div>
  )
}
