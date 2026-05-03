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
    <aside className='relative z-10 min-h-screen w-64 border-r border-white/5 bg-black/10 p-6 text-white backdrop-blur-2xl'>
      <div className='flex items-center gap-3 mb-8 px-2'>
        <div className='h-5 w-5 rounded-md bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' />
        <h1 className='display-type text-lg font-semibold tracking-tight'>solotutor</h1>
      </div>
      
      <nav className='flex flex-col gap-1'>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
          >
            <Icon size={18} className={label === 'YouTube' ? 'text-red-400' : ''} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className='mt-10'>
        <div className='px-4 mb-4 flex items-center justify-between'>
          <p className='text-[10px] font-bold uppercase tracking-widest text-slate-500'>Library</p>
        </div>
        <div className='space-y-1 max-h-[40vh] overflow-y-auto pr-1'>
          {files.map((f) => (
            <div
              key={f.doc_id}
              className='group relative flex items-center'
            >
              <button
                onClick={() => { setDocId(f.doc_id); setFilename(f.name) }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                  docId === f.doc_id
                    ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${docId === f.doc_id ? 'bg-blue-400' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                <span className='truncate pr-6'>{f.name}</span>
              </button>
              <button
                onClick={(e) => handleDelete(e, f.doc_id)}
                className='absolute right-2 p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200'
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
