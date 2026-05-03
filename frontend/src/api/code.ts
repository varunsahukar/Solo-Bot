import api from './client'
import type { CodeResponse } from '../types'
export const askCode = (query: string, docId = '') => api.post<CodeResponse>('/api/code', { query, doc_id: docId })
