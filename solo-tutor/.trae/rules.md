# Solo Tutor Rules

- frontend/src/api/ is the only backend caller
- storage/cloud/vectors.py is the only Supabase writer
- frontend/src/hooks/useIndexedDB.ts is the only Dexie importer
- backend routes must import only from agents/graph.py
- rag/ remains stateless (no DB writes)
