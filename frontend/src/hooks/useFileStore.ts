import { db, generateDocId } from './useIndexedDB'
import type { FileRecord } from '../types'

export function useFileStore() {
  const saveFile = async (file: File): Promise<string> => {
    const docId = generateDocId()
    await db.files.add({ doc_id: docId, name: file.name, type: file.name.split('.').pop() ?? 'unknown', blob: await file.arrayBuffer(), created_at: new Date().toISOString() })
    return docId
  }
  const saveFileRecord = async (record: FileRecord): Promise<void> => {
    await db.files.add(record)
  }
  const getFile = async (docId: string): Promise<FileRecord | undefined> => db.files.where('doc_id').equals(docId).first()
  const listFiles = async (): Promise<FileRecord[]> => (await db.files.toArray()).sort((a, b) => b.created_at.localeCompare(a.created_at))
  const deleteFile = async (docId: string): Promise<void> => { await db.files.where('doc_id').equals(docId).delete() }
  return { saveFile, saveFileRecord, getFile, listFiles, deleteFile }
}
