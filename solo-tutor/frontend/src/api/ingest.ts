import api from './client'
import type { IngestResponse } from '../types'
export const ingestFile = (file: File, docId: string) => { const f = new FormData(); f.append('file', file); f.append('doc_id', docId); return api.post<IngestResponse>('/api/ingest', f, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }) }
