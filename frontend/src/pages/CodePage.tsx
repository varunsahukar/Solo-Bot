import { useState } from 'react'
import { Terminal, Code, Cpu, Command } from 'lucide-react'
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
    try {
      const r = await askCode(q, docId ?? '')
      setAns(r.data.answer)
    } catch {
      setAns('System encountered an error during inference.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex h-full flex-col p-8'>
      <div className='mb-8 flex items-center justify-between border-b border-white/10 pb-4'>
        <h2 className='text-xs font-bold uppercase tracking-[0.3em] text-zinc-400'>Neural Workspace / Code Mentor</h2>
      </div>

      <div className='grid lg:grid-cols-2 gap-8 flex-1'>
        <div className='flex flex-col gap-4'>
           <div className='flex items-center gap-3 mb-2 px-2'>
              <Command size={14} className='text-blue-500' />
              <span className='text-[10px] font-bold uppercase tracking-widest text-zinc-500'>Query Input</span>
           </div>
           <textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className='flex-1 bg-zinc-950 border border-white/10 p-6 text-sm text-white font-mono outline-none focus:border-white transition-all placeholder:text-zinc-800'
            placeholder='Describe the feature or bug you want to discuss...'
          />
          <button
            onClick={submit}
            disabled={loading || !q.trim()}
            className='bg-white py-5 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-zinc-200 disabled:opacity-30'
          >
            {loading ? 'Synthesizing...' : 'Run Analysis'}
          </button>
        </div>

        <div className='flex flex-col gap-4'>
           <div className='flex items-center gap-3 mb-2 px-2'>
              <Terminal size={14} className='text-[#c0c0c0]' />
              <span className='text-[10px] font-bold uppercase tracking-widest text-zinc-500'>System Output</span>
           </div>
           <div className='flex-1 border border-white/5 bg-zinc-950/50 p-6 overflow-auto scrollbar-hide'>
              {ans ? (
                <div className='font-mono text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap'>
                   {ans}
                </div>
              ) : (
                <div className='h-full flex flex-col items-center justify-center opacity-20 grayscale'>
                   <Cpu size={48} className='mb-6' />
                   <p className='text-[10px] uppercase font-bold tracking-widest'>Awaiting Instructions</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
