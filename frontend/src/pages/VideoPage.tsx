import { useState, useEffect } from 'react'
import { Video, MessageSquare, Sparkles, ArrowRight, Play, Cpu, Bot } from 'lucide-react'
import { useActiveDoc } from '../store/activeDoc'
import { useFileStore } from '../hooks/useFileStore'
import { generateDocId } from '../hooks/useIndexedDB'
import { useChatCache } from '../hooks/useChatCache'
import { sendChat } from '../api/chat'
import api from '../api/client'
import type { Message } from '../types'

export default function VideoPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  
  const getThumbnail = (videoUrl: string) => {
    const id = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('be/')[1]?.split('?')[0]
    return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''
  }

  useEffect(() => {
    if (url) setThumbnail(getThumbnail(url))
  }, [url])

  // Chat state
  const [q, setQ] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  
  const { docId, setDocId, setFilename } = useActiveDoc()
  const { saveFileRecord } = useFileStore()
  const cache = useChatCache(docId ?? '')

  useEffect(() => {
    if (docId) {
      cache.getHistory().then(setMessages).catch(() => setMessages([]))
    }
  }, [docId])

  const processYoutube = async () => {
    if (!url.trim() || loading) return
    setLoading(true)
    setSummary('')
    setMessages([])
    const newDocId = generateDocId()
    
    try {
      const res = await api.post('/api/video/youtube', { url, doc_id: newDocId })
      setSummary(res.data.summary)

      await saveFileRecord({
        doc_id: newDocId,
        name: `YouTube: ${url.split('v=')[1]?.split('&')[0] || 'Video'}`,
        type: 'video/youtube',
        blob: new TextEncoder().encode(url).buffer,
        created_at: new Date().toISOString()
      })

      setDocId(newDocId)
      setFilename(`YouTube Video`)
      
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to process YouTube video')
    } finally {
      setLoading(false)
    }
  }

  const ask = async () => {
    if (!docId || !q.trim() || chatLoading) return
    setChatLoading(true)
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
      setChatLoading(false)
    }
  }

  return (
    <div className='flex h-full flex-col p-8'>
      <div className='mb-8 flex items-center justify-between border-b border-white/10 pb-4'>
        <h2 className='text-xs font-bold uppercase tracking-[0.3em] text-zinc-400'>Neural Workspace / Video Intelligence</h2>
      </div>

      <div className='grid lg:grid-cols-5 gap-8 flex-1'>
        <div className='lg:col-span-3 flex flex-col'>
          <div className='mb-8 border border-white/10 bg-zinc-950/50 p-6'>
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                 <input
                  type='text'
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder='YouTube Source URL...'
                  className='w-full bg-zinc-900 border border-white/5 p-4 text-sm text-white font-mono outline-none focus:border-white transition-all placeholder:text-zinc-800'
                />
              </div>
              <button
                onClick={processYoutube}
                disabled={loading || !url.trim()}
                className='bg-white px-8 text-xs font-bold uppercase tracking-widest text-black hover:bg-zinc-200 disabled:opacity-30 transition-all'
              >
                {loading ? 'Synthesizing...' : 'Summarize'}
              </button>
            </div>
          </div>

          <div className='flex-1 flex flex-col gap-6 overflow-auto scrollbar-hide'>
             <div className='flex items-center gap-3 px-2'>
                <Cpu size={14} className='text-blue-500' />
                <span className='text-[10px] font-bold uppercase tracking-widest text-zinc-500'>Analysis Summary</span>
             </div>

             {thumbnail && (
               <div className='border border-white/5 p-1 bg-zinc-950 mb-2'>
                 <img src={thumbnail} alt='Preview' className='w-full grayscale contrast-125 opacity-80 aspect-video object-cover' />
               </div>
             )}

             <div className='flex-1 border border-white/5 bg-zinc-950/50 p-8'>
                {summary ? (
                  <div className='prose prose-invert max-w-none'>
                    <div className='text-zinc-300 leading-relaxed text-sm whitespace-pre-wrap font-light'>
                      {summary}
                    </div>
                  </div>
                ) : (
                  <div className='h-full flex flex-col items-center justify-center opacity-20 grayscale'>
                    <Play size={48} className='mb-6' />
                    <p className='text-[10px] uppercase font-bold tracking-widest'>Ready for Input</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className='lg:col-span-2 flex flex-col border-l border-white/5 pl-8'>
           <div className='flex items-center gap-3 mb-6 px-2'>
              <MessageSquare size={14} className='text-purple-500' />
              <span className='text-[10px] font-bold uppercase tracking-widest text-zinc-500'>Knowledge Chat</span>
           </div>
           
           <div className='flex-1 flex flex-col border border-white/5 bg-black overflow-hidden relative'>
              <div className='flex-1 overflow-auto p-6 space-y-6 scrollbar-hide'>
                {messages.length === 0 && (
                  <div className='flex flex-col items-center justify-center h-full opacity-10 text-center px-6'>
                    <Bot size={48} className='mb-6' />
                    <p className='text-[10px] uppercase font-bold tracking-widest'>Neural Context Empty</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className='mb-1 text-[9px] font-bold uppercase tracking-widest text-zinc-700'>
                      {m.role === 'user' ? 'User' : 'Assistant'}
                    </div>
                    <div
                      className={`max-w-[90%] border p-4 text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'border-white/10 bg-white text-black'
                          : 'border-white/5 bg-zinc-950 text-zinc-400'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className='flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400 animate-pulse'>
                    <Sparkles size={12} />
                    <span>Processing...</span>
                  </div>
                )}
              </div>

              <div className='p-6 border-t border-white/5 bg-black sticky bottom-0'>
                <div className='flex items-center gap-2'>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && ask()}
                    placeholder='Ask about video...'
                    className='flex-1 bg-zinc-950 border border-white/10 px-4 py-3 text-xs text-white outline-none focus:border-white transition placeholder:text-zinc-800'
                  />
                  <button
                    onClick={ask}
                    disabled={chatLoading || !q.trim() || !docId}
                    className='p-3 bg-white text-black hover:bg-zinc-200 disabled:opacity-30 transition-all'
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
