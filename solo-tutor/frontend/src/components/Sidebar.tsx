import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MessageSquare, Upload, BookOpen, Code2, Home, Database } from 'lucide-react'
import { useActiveDoc } from '../store/activeDoc'
import { useFileStore } from '../hooks/useFileStore'
import type { FileRecord } from '../types'

const navItems = [
  { to: '/', icon: Home, label: 'Landing' },
  { to: '/app/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/app/upload', icon: Upload, label: 'Upload' },
  { to: '/app/quiz', icon: BookOpen, label: 'Quiz' },
  { to: '/app/code', icon: Code2, label: 'Code' },
  { to: '/app/supabase', icon: Database, label: 'Supabase' },
]

export default function Sidebar() {
  const { docId, setDocId, setFilename } = useActiveDoc()
  const { listFiles } = useFileStore()
  const [files, setFiles] = useState<FileRecord[]>([])

  useEffect(() => {
    listFiles().then(setFiles).catch(() => setFiles([]))
  }, [docId])

  return (
    <aside className='relative z-10 min-h-screen w-60 border-r border-white/10 bg-black/40 p-4 text-white backdrop-blur-sm'>
      <h1 className='display-type mb-6 text-base text-white'>solotutor</h1>
      <nav className='flex flex-col gap-2'>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? 'border border-white/30 bg-white/10 text-white'
                  : 'border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className='mt-6'>
        <p className='mb-2 text-xs uppercase tracking-[0.12em] text-slate-400'>Documents</p>
        <div className='space-y-1'>
          {files.map((f) => (
            <button
              key={f.doc_id}
              onClick={() => { setDocId(f.doc_id); setFilename(f.name) }}
              className={`w-full truncate rounded-md border px-2 py-2 text-left text-xs transition ${
                docId === f.doc_id
                  ? 'border-white/30 bg-white/10 text-white'
                  : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
