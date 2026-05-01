# SoloTutor Workspace

This repository contains multiple project experiments and app variants.  
The main active app is under `solo-tutor/`.

## Quick Start

1. Clone the repo.
2. Copy `.env.example` to `.env` in the workspace root and fill keys.
3. Apply Supabase schema from `storage/cloud/schema.sql` (or `solo-tutor/storage/cloud/schema.sql` for the app variant).

## Run Main App (`solo-tutor/`)

### Backend

```bash
cd solo-tutor/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd solo-tutor/frontend
npm install
npm run dev
```

## Health and Readiness Checks

- Health: `GET http://localhost:8000/health`
- Readiness (env/dependency diagnostics): `GET http://localhost:8000/ready`

## Architecture Contract

- User -> Frontend (React + Dexie IndexedDB)
- Frontend -> Backend (FastAPI API layer)
- Backend -> Agents (LangGraph orchestration)
- Agents -> RAG (LangChain transforms)
- RAG -> Supabase (vectors/storage)
- RAG context -> LLM providers (xAI/OpenAI with fallback strategy)

## Layer Rules

1. `frontend/src/api/` is the only frontend folder that calls backend APIs.
2. `rag/` and `storage/cloud/` are the only backend areas that touch Supabase.
3. `frontend/src/hooks/useIndexedDB.ts` is the only place importing Dexie directly.
4. `agents/graph.py` is the only agents entry imported by backend routes.

## Tests

```bash
cd solo-tutor/backend
pytest tests/ -v
```
