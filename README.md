# SOLO TUTOR

AI-powered study app: chat with documents, generate quizzes, explain code, summarize videos.

## Current UI Routes

- Landing page: `http://localhost:5173/`
- Workspace chat: `http://localhost:5173/app/chat`
- Upload: `http://localhost:5173/app/upload`
- Quiz: `http://localhost:5173/app/quiz`
- Code assistant: `http://localhost:5173/app/code`

## Setup
1. `cp .env.example .env` and fill all keys
2. Run Supabase SQL from `storage/cloud/schema.sql` in Supabase dashboard

## Run Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Backend diagnostics

- `GET /health` -> service heartbeat
- `GET /ready` -> env/provider readiness checks

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## Test
```bash
cd backend && pytest tests/ -v
```

## Provider Notes

- **LLM**: Powered by **Groq** (llama-3.1-8b-instant) for low-latency, high-performance inference.
- **Embeddings**: Uses **FastEmbed** for local, memory-efficient vector embeddings.
- **Database**: **Supabase** is used for vector storage and authentication.
- **Transcripts**: **yt-dlp** and **youtube-transcript-api** are used for video processing.

