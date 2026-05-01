import { useState } from 'react'
import { ingestFile } from '../api/ingest'
import { useFileStore } from '../hooks/useFileStore'
import { useActiveDoc } from '../store/activeDoc'

export default function UploadPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const { saveFile } = useFileStore(); const { setDocId, setFilename } = useActiveDoc()
  const onFile = async (file?: File) => {
    if (!file || loading) return
    setLoading(true)
    setStatus('Saving file and indexing...')
    try { const docId = await saveFile(file); await ingestFile(file, docId); setDocId(docId); setFilename(file.name); setStatus('Uploaded and indexed.') }
    catch (error: unknown) {
      const maybeResponse = (error as { response?: { data?: { detail?: string } } })?.response
      const detail = maybeResponse?.data?.detail
      setStatus(detail ? `Upload failed: ${detail}` : 'Upload failed. Check backend and API keys.')
    }
    finally { setLoading(false) }
  }
  return (
    <div className='mx-auto max-w-3xl p-8'>
      <h2 className='mb-4 text-2xl font-semibold text-white'>Upload</h2>
      <div className='rounded-2xl border border-white/10 bg-black/40 p-6'>
        <input
          type='file'
          disabled={loading}
          onChange={(e) => onFile(e.target.files?.[0])}
          className='w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-200 file:mr-3 file:rounded-lg file:border file:border-white/20 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-black'
        />
        <p className='mt-4 text-sm text-slate-400'>{status}</p>
      </div>
    </div>
  )
}
