# SOLO TUTOR

AI-powered study app: chat with documents, generate quizzes, explain code, summarize videos.

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
