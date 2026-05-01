import { useState } from 'react'
import { generateQuiz } from '../api/quiz'
import { useActiveDoc } from '../store/activeDoc'
import type { QuizQuestion } from '../types'

export default function QuizPage() {
  const { docId } = useActiveDoc()
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  const load = async () => {
    if (!docId || loading) return
    setLoading(true)
    try { const r = await generateQuiz(docId, topic); setQuestions(r.data.questions || []) }
    catch { setQuestions([]) }
    finally { setLoading(false) }
  }

  if (!docId) return <div className='p-8 text-slate-400'>Upload a document first.</div>
  return (
    <div className='mx-auto max-w-4xl p-8'>
      <h2 className='mb-4 text-2xl font-semibold tracking-wide text-white'>Quiz</h2>
      <div className='flex gap-2 mb-4'>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder='Optional topic'
          className='flex-1 rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-white/35'
        />
        <button
          onClick={load}
          disabled={loading}
          className='rounded-xl border border-white/20 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:opacity-60'
        >
          {loading ? 'Generating...' : 'Generate quiz'}
        </button>
      </div>
      <div className='mt-4 space-y-3'>
        {questions.map((q, i) => (
          <div key={i} className='rounded-xl border border-white/10 bg-black/40 p-4'>
            <p className='font-medium text-white'>
              {i + 1}. {q.question}
            </p>
            {q.options?.length > 0 && (
              <ul className='mt-2 text-sm text-slate-300'>
                {q.options.map((opt) => (
                  <li key={opt}>- {opt}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
