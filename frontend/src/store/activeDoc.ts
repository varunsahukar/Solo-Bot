import { create } from 'zustand'
interface ActiveDocState { docId: string | null; filename: string; setDocId: (id: string) => void; setFilename: (name: string) => void; clear: () => void }
export const useActiveDoc = create<ActiveDocState>((set) => ({ docId: null, filename: '', setDocId: (docId) => set({ docId }), setFilename: (filename) => set({ filename }), clear: () => set({ docId: null, filename: '' }) }))
