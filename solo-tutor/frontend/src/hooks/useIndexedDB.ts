import Dexie, { type EntityTable } from 'dexie'
import { nanoid } from 'nanoid'
import type { CacheRecord, FileRecord, PrefRecord, SessionRecord } from '../types'

class SoloTutorDB extends Dexie {
  files!: EntityTable<FileRecord, 'id'>
  sessions!: EntityTable<SessionRecord, 'id'>
  cache!: EntityTable<CacheRecord, 'query_hash'>
  prefs!: EntityTable<PrefRecord, 'key'>
  constructor() {
    super('SoloTutorDB')
    this.version(1).stores({ files: '++id,doc_id,name,type,created_at', sessions: '++id,doc_id,updated_at', cache: 'query_hash,doc_id', prefs: 'key' })
  }
}
export const db = new SoloTutorDB()
export const generateDocId = (): string => nanoid(12)
