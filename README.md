## Setup
1. Clone the repo
2. Copy .env.example to .env and fill in all keys
3. Run the Supabase SQL schema from storage/cloud/schema.sql

## Run backend
cd backend
python -m venv .venv
source .venv/bin/activate  (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

## Run frontend
cd frontend
npm install
npm run dev

## Architecture
Layer contract:
- User → Frontend (React + Dexie IndexedDB)
- Frontend → Backend (FastAPI, API bridge only)
- Backend → Agents (LangGraph, decision making)
- Agents → RAG (LangChain, stateless transforms)
- RAG → Supabase (embeddings) / IndexedDB (files, cache)
- RAG + context → LLM (Grok → OpenAI fallback)

## Layer rules (must never be broken)
1. frontend/src/api/ is the only folder that calls the backend
2. rag/ and storage/cloud/ are the only files that touch Supabase
3. frontend/src/hooks/useIndexedDB.ts is the only file that imports Dexie
4. agents/graph.py is the only file the backend routes import from agents/

## Run tests
cd backend && pytest tests/ -v
