import { useState } from 'react'
import { CheckCircle, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react'
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

  if (!docId) return <div className='p-8 text-zinc-500 font-bold uppercase tracking-widest text-xs'>Select a document to generate a quiz.</div>

  return (
    <div className='flex h-full flex-col p-8'>
      <div className='mb-8 flex items-center justify-between border-b border-white/10 pb-4'>
        <h2 className='text-xs font-bold uppercase tracking-[0.3em] text-zinc-400'>Neural Workspace / Adaptive Quiz</h2>
      </div>

      <div className='mb-12 flex gap-2'>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder='Topic (e.g. "React Hooks", "History")'
          className='flex-1 bg-zinc-950 border border-white/10 p-4 text-sm text-white outline-none focus:border-white transition placeholder:text-zinc-700'
        />
        <button
          onClick={load}
          disabled={loading}
          className='bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-zinc-200 disabled:opacity-30'
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {questions.length > 0 && (
        <div className='space-y-12 pb-20'>
          {questions.map((q, i) => {
            return (
              <div key={i} className='border border-white/5 bg-zinc-950/30 p-8 relative'>
                <div className='absolute -left-4 top-8 flex h-8 w-8 items-center justify-center bg-zinc-900 border border-white/10 text-[10px] font-bold text-white'>
                   {i + 1}
                </div>
                
                <p className='text-lg font-bold text-white mb-8 pl-4'>{q.question}</p>
                
                <div className='grid gap-4 pl-4'>
                  {q.options.map((opt) => {
                    const isSelected = userAnswers[i] === opt;
                    const isCorrect = isMatch(q.answer, opt);
                    let className = 'cursor-pointer border p-4 text-xs font-bold uppercase tracking-widest transition-all ';
                    
                    if (submitted) {
                      if (isCorrect) className += 'border-emerald-500/50 bg-emerald-500/5 text-emerald-500 ';
                      else if (isSelected && !isCorrect) className += 'border-red-500/50 bg-red-500/5 text-red-500 ';
                      else className += 'border-white/5 bg-transparent text-zinc-700 ';
                    } else {
                      className += isSelected 
                        ? 'border-white bg-white text-black ' 
                        : 'border-white/10 bg-transparent text-zinc-500 hover:border-white/30 hover:text-white ';
                    }

                    return (
                      <div key={opt} onClick={() => handleSelect(i, opt)} className={className}>
                        {opt}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              className='w-full bg-white py-6 text-sm font-bold uppercase tracking-[0.2em] text-black hover:bg-zinc-200 shadow-2xl'
            >
              Submit Quiz
            </button>
          ) : (
            <div className='border border-blue-500/30 bg-blue-500/5 p-12 text-center'>
              <h3 className='text-xs font-bold uppercase tracking-[0.4em] text-blue-400 mb-4'>Assessment Result</h3>
              <p className='text-5xl font-black text-white mb-6 display-type'>
                {score} <span className='text-zinc-700 text-3xl font-light'>/ {questions.length}</span>
              </p>
              <button
                onClick={load}
                className='inline-flex items-center gap-3 bg-white px-10 py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-zinc-200'
              >
                <RefreshCw size={14} />
                New Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
