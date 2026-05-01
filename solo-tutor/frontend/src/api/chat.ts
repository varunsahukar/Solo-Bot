import api from './client'
import type { ChatResponse } from '../types'
export const sendChat = (query: string, docId: string) => api.post<ChatResponse>('/api/chat', { query, doc_id: docId })
