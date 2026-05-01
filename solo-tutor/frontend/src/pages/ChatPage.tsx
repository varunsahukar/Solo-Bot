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

  if (!docId) return <div className='p-8 text-slate-400'>Upload a document first.</div>
  return (
    <div className='mx-auto max-w-4xl p-8'>
      <h2 className='mb-4 text-2xl font-semibold tracking-wide text-white'>Chat</h2>
      <div className='mb-4 max-h-[60vh] space-y-3 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4'>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap rounded-xl border p-3 text-sm ${
              m.role === 'user'
                ? 'border-white/25 bg-white/10 text-white'
                : 'border-white/10 bg-white/5 text-slate-100'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <div className='rounded-xl border border-white/10 bg-white/5 p-3 text-slate-400'>Thinking...</div>}
      </div>
      <div className='flex gap-2'>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className='flex-1 rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-white/35'
          placeholder='Ask about your doc'
        />
        <button
          onClick={ask}
          disabled={loading || !q.trim()}
          className='rounded-xl border border-white/20 bg-white px-4 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:opacity-60'
        >
          Send
        </button>
      </div>
    </div>
  )
}
