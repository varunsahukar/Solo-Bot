import api from './client'
import type { QuizResponse } from '../types'
export const generateQuiz = (docId: string, topic = '') => api.post<QuizResponse>('/api/quiz', { doc_id: docId, topic })
