import { useState } from 'react'
import { Upload, FileText, CheckCircle } from 'lucide-react'
import { ingestFile } from '../api/ingest'
import { useFileStore } from '../hooks/useFileStore'
import { useActiveDoc } from '../store/activeDoc'

export default function UploadPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const { saveFile } = useFileStore()
  const { setDocId, setFilename } = useActiveDoc()

  const onFile = async (file?: File) => {
    if (!file || loading) return
    setLoading(true)
    setStatus('Indexing...')
    try {
      const docId = await saveFile(file)
      await ingestFile(file, docId)
      setDocId(docId)
      setFilename(file.name)
      setStatus('Document successfully synchronized.')
    } catch (error: unknown) {
      const maybeResponse = (error as { response?: { data?: { detail?: string } } })?.response
      const detail = maybeResponse?.data?.detail
      setStatus(detail ? `Error: ${detail}` : 'Synchronization failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex h-full flex-col p-8'>
      <div className='mb-6 flex items-center justify-between border-b border-white/10 pb-4'>
        <h2 className='text-xs font-bold uppercase tracking-[0.3em] text-zinc-400'>Neural Workspace / Upload</h2>
      </div>

      <div className='flex-1 flex flex-col items-center justify-center'>
        <div className='w-full max-w-xl border border-white/10 bg-zinc-950/50 p-12 text-center relative overflow-hidden'>
          <div className='absolute inset-0 bg-blue-500/5 opacity-50' style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          
          <div className='relative z-10'>
            <div className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-white/10 ${loading ? 'animate-pulse text-blue-400' : 'text-zinc-600'}`}>
              <Upload size={32} />
            </div>
            
            <h3 className='mb-4 text-sm font-bold uppercase tracking-widest text-white'>Ingest Source Material</h3>
            <p className='mb-10 text-xs font-light leading-relaxed text-zinc-500'>
              Upload your PDF or text documents to expand your neural knowledge base. 
              Our system will chunk, index, and prepare the material for instant retrieval.
            </p>

            <div className='relative'>
              <input
                type='file'
                disabled={loading}
                onChange={(e) => onFile(e.target.files?.[0])}
                className='absolute inset-0 cursor-pointer opacity-0'
              />
              <button className='w-full border border-white/20 bg-white py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-zinc-200 transition-all'>
                {loading ? 'Processing...' : 'Select Document'}
              </button>
            </div>

            {status && (
              <div className='mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 animate-in fade-in slide-in-from-bottom-2 duration-500'>
                {status.includes('Error') ? <FileText size={12} className='text-red-500' /> : <CheckCircle size={12} className='text-emerald-500' />}
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
