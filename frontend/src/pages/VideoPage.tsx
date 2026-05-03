import { useState, useEffect } from 'react'
import { Video, MessageSquare, Sparkles, ArrowRight } from 'lucide-react'

import { useActiveDoc } from '../store/activeDoc'
import { useFileStore } from '../hooks/useFileStore'
import { generateDocId } from '../hooks/useIndexedDB'
import { useChatCache } from '../hooks/useChatCache'
import { sendChat } from '../api/chat'
import axios from 'axios'
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
      // 1. Fetch transcript, trigger ingestion (BG), and get summary (Fast Path)
      const res = await axios.post('http://localhost:8000/api/video/youtube', { url, doc_id: newDocId })
      
      // 2. Set the summary immediately from the first response
      setSummary(res.data.summary)

      // 3. Save a virtual file record
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
    <div className='flex h-full flex-col p-8 lg:p-12 overflow-auto'>
      <div className='mx-auto w-full max-w-6xl'>
        <div className='mb-12'>
          <h2 className='display-type text-4xl font-semibold tracking-tight mb-3'>
            Video Intelligence
          </h2>
          <p className='text-slate-400 text-lg'>Transform any YouTube video into structured lessons.</p>
        </div>

        <div className='glass-panel p-6 mb-12 shadow-2xl transition-all duration-300 hover:border-white/10'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='relative flex-1'>
              <input
                type='text'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder='Paste YouTube URL'
                className='w-full rounded-xl bg-white/5 border border-white/5 px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all'
              />
            </div>
            <button
              onClick={processYoutube}
              disabled={loading || !url.trim()}
              className='rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50'
            >

              {loading ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent' />
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Summarize'
              )}
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-10 lg:grid-cols-5'>
          <div className='lg:col-span-3 space-y-6'>
            <div className='flex items-center gap-3 mb-2 px-2'>
              <div className='h-2 w-2 rounded-full bg-blue-400 animate-pulse' />
              <h3 className='text-sm font-bold uppercase tracking-widest text-slate-400'>Analysis Summary</h3>
            </div>

            {thumbnail && (
              <div className='glass-panel p-2 mb-6 overflow-hidden animate-in fade-in zoom-in-95 duration-500'>
                <img src={thumbnail} alt='Video Preview' className='w-full rounded-lg aspect-video object-cover' />
              </div>
            )}

            {summary ? (
              <div className='glass-panel p-10 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700'>

                <div className='prose prose-invert max-w-none'>
                  <div className='space-y-6 text-slate-200 leading-relaxed text-lg whitespace-pre-wrap font-light'>
                    {summary}
                  </div>
                </div>
              </div>
            ) : (
              <div className='glass-panel h-[500px] flex flex-col items-center justify-center border-dashed opacity-40 group'>
                <div className='h-16 w-16 rounded-full border border-white/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110'>
                  <Video size={24} className='text-slate-400' />
                </div>
                <p className='text-slate-500 font-medium'>Paste a link to see analysis</p>
              </div>
            )}
          </div>

          {/* Right: Integrated Chat (2/5 columns) */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='flex items-center gap-3 mb-2 px-2'>
              <div className='h-2 w-2 rounded-full bg-purple-400 animate-pulse' />
              <h3 className='text-sm font-bold uppercase tracking-widest text-slate-400'>Knowledge Chat</h3>
            </div>
            <div className='glass-panel flex flex-col h-[600px] overflow-hidden shadow-2xl relative'>
              <div className='flex-1 overflow-auto p-6 space-y-6 scrollbar-hide'>
                {messages.length === 0 && (
                  <div className='flex flex-col items-center justify-center h-full opacity-30 text-center px-6'>
                    <MessageSquare size={32} className='mb-4' />
                    <p className='text-sm'>Generate a summary first to start chatting about the video content.</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in zoom-in-95 duration-300`}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                        m.role === 'user'
                          ? 'bg-blue-500 text-white font-medium rounded-tr-none'
                          : 'bg-white/5 border border-white/10 text-slate-100 rounded-tl-none'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className='flex items-center gap-2 text-xs text-blue-400 animate-pulse font-medium'>
                    <Sparkles size={14} />
                    <span>Gemini is thinking...</span>
                  </div>
                )}
              </div>

              <div className='p-6 bg-black/20 border-t border-white/5'>
                <div className='relative flex items-center gap-2'>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && ask()}
                    placeholder='Ask about the video...'
                    className='flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                  />
                  <button
                    onClick={ask}
                    disabled={chatLoading || !q.trim() || !docId}
                    className='p-3 rounded-xl bg-white/10 border border-white/10 text-white transition-all hover:bg-white/20 active:scale-95 disabled:opacity-30'
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
