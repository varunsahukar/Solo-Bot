export type DocId = string
export interface Message { role: 'user' | 'assistant'; content: string; timestamp: string; chunks_used?: number }
export interface FileRecord { id?: number; doc_id: DocId; name: string; type: string; blob: ArrayBuffer; created_at: string }
export interface SessionRecord { id?: number; doc_id: DocId; messages: Message[]; updated_at: string }
export interface CacheRecord { query_hash: string; doc_id: DocId; answer: string; sources: string[]; cached_at: string }
export interface PrefRecord { key: string; value: string }
export interface ChatResponse { answer: string; sources: string[]; chunks_used: number }
export interface IngestResponse { status: string; chunks_stored: number }
export interface QuizQuestion { question: string; options: string[]; answer: string }
export interface QuizResponse { questions: QuizQuestion[] }
export interface CodeResponse { answer: string }
