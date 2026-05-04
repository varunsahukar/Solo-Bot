import { useEffect, useState } from 'react'
import { sendChat } from '../api/chat'
import { useActiveDoc } from '../store/activeDoc'
import { useChatCache } from '../hooks/useChatCache'
import type { Message } from '../types'

export default function ChatPage() {
  const { docId } = useActiveDoc()
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const cache = useChatCache(docId ?? '')

  useEffect(() => {
    if (!docId) return
    cache.getHistory().then(setMessages).catch(() => setMessages([]))
  }, [docId])

  const ask = async () => {
    if (!docId || !q.trim() || loading) return
    setLoading(true)
    const question = q.trim()
    setQ('')
    const userMsg: Message = { role: 'user', content: question, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    await cache.appendMessage(userMsg)
    try {
      const cached = await cache.getCached(question)
      const answer = cached ?? (await sendChat(question, docId)).data.answer
      if (!cached) await cache.setCached(question, answer, [])
      const botMsg: Message = { role: 'assistant', content: answer, timestamp: new Date().toISOString() }
      setMessages((prev) => [...prev, botMsg])
      await cache.appendMessage(botMsg)
    } catch {
      const botMsg: Message = { role: 'assistant', content: 'Error getting response.', timestamp: new Date().toISOString() }
      setMessages((prev) => [...prev, botMsg])
    } finally {
      setLoading(false)
    }
  }

  if (!docId) return <div className='p-8 text-zinc-500 font-bold uppercase tracking-widest text-xs'>Upload a document to start chatting.</div>
  
  return (
    <div className='flex h-full flex-col p-8'>
      <div className='mb-6 flex items-center justify-between border-b border-white/10 pb-4'>
        <h2 className='text-xs font-bold uppercase tracking-[0.3em] text-zinc-400'>Neural Workspace / Chat</h2>
      </div>
      
      <div className='flex-1 space-y-6 overflow-auto scrollbar-hide mb-8'>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className='mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
              {m.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div
              className={`max-w-[80%] border p-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'border-white/10 bg-white text-black'
                  : 'border-white/5 bg-zinc-900 text-zinc-300'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className='flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white animate-pulse'>
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <div className='flex gap-2 bg-black border-t border-white/10 pt-4 sticky bottom-0'>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          className='flex-1 bg-zinc-950 border border-white/10 p-4 text-sm text-white outline-none focus:border-white transition placeholder:text-zinc-700'
          placeholder='Send message...'
        />
        <button
          onClick={ask}
          disabled={loading || !q.trim()}
          className='bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-zinc-200 disabled:opacity-30'
        >
          Send
        </button>
      </div>
    </div>
  )
}
