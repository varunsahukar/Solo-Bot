import { db } from './useIndexedDB'
import type { Message } from '../types'

const hashString = (s: string) => Math.abs([...s].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)).toString(36)

export function useChatCache(docId: string) {
  const key = (query: string) => hashString(query + docId)
  const getCached = async (query: string): Promise<string | null> => (await db.cache.get(key(query)))?.answer ?? null
  const setCached = async (query: string, answer: string, sources: string[]) => { try { await db.cache.put({ query_hash: key(query), doc_id: docId, answer, sources, cached_at: new Date().toISOString() }) } catch {} }
  const getHistory = async (): Promise<Message[]> => (await db.sessions.where('doc_id').equals(docId).first())?.messages ?? []
  const appendMessage = async (message: Message): Promise<void> => { try { const s = await db.sessions.where('doc_id').equals(docId).first(); s?.id ? await db.sessions.update(s.id, { messages: [...(s.messages ?? []), message], updated_at: new Date().toISOString() }) : await db.sessions.add({ doc_id: docId, messages: [message], updated_at: new Date().toISOString() }) } catch {} }
  return { getCached, setCached, getHistory, appendMessage }
}
