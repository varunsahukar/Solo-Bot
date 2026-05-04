import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MessageSquare, Upload, BookOpen, Code2, Home, Video, Trash2 } from 'lucide-react'
import { useActiveDoc } from '../store/activeDoc'
import { useFileStore } from '../hooks/useFileStore'
import type { FileRecord } from '../types'

const navItems = [
  { to: '/', icon: Home, label: 'Landing' },
  { to: '/app/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/app/upload', icon: Upload, label: 'Upload' },
  { to: '/app/video', icon: Video, label: 'YouTube' },
  { to: '/app/quiz', icon: BookOpen, label: 'Quiz' },
  { to: '/app/code', icon: Code2, label: 'Code' },
]

export default function Sidebar() {
  const { docId, setDocId, setFilename } = useActiveDoc()
  const { listFiles, deleteFile } = useFileStore()
  const [files, setFiles] = useState<FileRecord[]>([])

  const refreshFiles = () => listFiles().then(setFiles).catch(() => setFiles([]))

  useEffect(() => {
    refreshFiles()
  }, [docId])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to remove this document?')) {
      await deleteFile(id)
      if (docId === id) setDocId('')
      refreshFiles()
    }
  }

  return (
    <aside className='relative z-10 min-h-screen w-64 border-r border-white/5 bg-transparent p-6 text-white'>
      <div className='flex items-center gap-2 mb-10 px-2'>
        <div className='h-2 w-2 bg-[#c0c0c0]' />
        <h1 className='display-type text-sm font-bold uppercase tracking-[0.3em] text-[#c0c0c0]'>solotutor</h1>
      </div>

      
      <nav className='flex flex-col gap-1'>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-none px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                isActive
                  ? 'bg-white text-black shadow-lg border-l-2 border-blue-500'
                  : 'text-zinc-500 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={14} className={to === '/app/video' ? 'text-red-500/50' : to === '/app/code' ? 'text-blue-500/50' : to === '/app/quiz' ? 'text-emerald-500/50' : ''} />
            {label}
          </NavLink>

        ))}
      </nav>

      <div className='mt-12'>
        <div className='px-4 mb-4 flex items-center justify-between'>
          <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600'>Library</p>
        </div>
        <div className='space-y-1 max-h-[40vh] overflow-y-auto pr-1 scrollbar-hide'>
          {files.map((f) => (
            <div
              key={f.doc_id}
              className='group relative flex items-center'
            >
              <button
                onClick={() => { setDocId(f.doc_id); setFilename(f.name) }}
                className={`flex w-full items-center gap-3 rounded-none px-4 py-3 text-left text-[10px] uppercase font-bold tracking-widest transition-all duration-200 ${
                  docId === f.doc_id
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className='truncate pr-6'>{f.name}</span>
              </button>
              <button
                onClick={(e) => handleDelete(e, f.doc_id)}
                className='absolute right-2 p-2 text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200'
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
