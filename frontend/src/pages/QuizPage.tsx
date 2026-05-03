import { useState } from 'react'
import { generateQuiz } from '../api/quiz'
import { useActiveDoc } from '../store/activeDoc'
import type { QuizQuestion } from '../types'

export default function QuizPage() {
  const { docId } = useActiveDoc()
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const load = async () => {
    if (!docId || loading) return
    setLoading(true)
    setSubmitted(false)
    setUserAnswers({})
    try {
      const r = await generateQuiz(docId, topic)
      setQuestions(r.data.questions || [])
    } catch {
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (qIdx: number, opt: string) => {
    if (submitted) return
    setUserAnswers((prev) => ({ ...prev, [qIdx]: opt }))
  }

  const isMatch = (val1: string, val2: string) => {
    if (!val1 || !val2) return false
    const clean = (s: string) => s.trim().toLowerCase().replace(/^[a-d][\.\)\-\s]+/, '')
    return clean(val1) === clean(val2)
  }

  const score = questions.reduce((acc, q, i) => {
    return isMatch(userAnswers[i], q.answer) ? acc + 1 : acc
  }, 0)

  if (!docId) return <div className='p-8 text-slate-400'>Upload a document first.</div>

  return (
    <div className='mx-auto max-w-4xl p-8'>
      <h2 className='mb-4 text-2xl font-semibold tracking-wide text-white'>Quiz</h2>
      <div className='flex gap-2 mb-6'>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder='Topic (e.g. "React Hooks", "History")'
          className='flex-1 rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-white/35 outline-none'
        />
        <button
          onClick={load}
          disabled={loading}
          className='rounded-xl border border-white/20 bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:opacity-60'
        >
          {loading ? 'Generating...' : 'Start Quiz'}
        </button>
      </div>

      {questions.length > 0 && (
        <div className='space-y-6'>
          {questions.map((q, i) => {
            const hasAnyMatch = q.options.some(opt => isMatch(q.answer, opt));
            
            return (
              <div key={i} className='rounded-2xl border border-white/10 bg-black/40 p-6 shadow-xl transition-all'>
                <p className='text-lg font-medium text-white mb-4'>
                  <span className='mr-2 text-slate-500'>{i + 1}.</span>
                  {q.question}
                </p>
                <div className='grid gap-3'>
                  {q.options.map((opt) => {
                    const isSelected = userAnswers[i] === opt;
                    const isCorrect = isMatch(q.answer, opt);
                    let className = 'cursor-pointer rounded-xl border p-4 text-sm transition-all ';
                    
                    if (submitted) {
                      if (isCorrect) className += 'border-green-500/50 bg-green-500/10 text-green-400 ';
                      else if (isSelected && !isCorrect) className += 'border-red-500/50 bg-red-500/10 text-red-400 ';
                      else className += 'border-white/5 bg-white/5 text-slate-500 ';
                    } else {
                      className += isSelected 
                        ? 'border-white/40 bg-white/10 text-white ' 
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 ';
                    }

                    return (
                      <div key={opt} onClick={() => handleSelect(i, opt)} className={className}>
                        {opt}
                      </div>
                    );
                  })}
                </div>
                {submitted && !hasAnyMatch && (
                  <div className='mt-4 rounded-lg bg-yellow-500/10 p-3 text-xs text-yellow-500 border border-yellow-500/20'>
                    Note: The AI's recorded answer ("{q.answer}") didn't perfectly match any option.
                  </div>
                )}
              </div>
            );
          })}

          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              className='w-full rounded-xl bg-blue-600 p-4 font-bold text-white transition hover:bg-blue-500'
            >
              Submit Quiz
            </button>
          ) : (
            <div className='rounded-2xl border border-blue-500/30 bg-blue-500/10 p-8 text-center'>
              <h3 className='text-2xl font-bold text-white mb-2'>Quiz Completed!</h3>
              <p className='text-slate-300'>
                You scored <span className='text-blue-400 text-xl font-bold'>{score}</span> out of {questions.length}
              </p>
              <button
                onClick={load}
                className='mt-4 rounded-xl border border-white/20 bg-white px-6 py-2 text-sm font-semibold text-black hover:bg-slate-200'
              >
                Try Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
