import os
import sys
import logging
from typing import Any
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.config import get_settings, get_supabase_key, get_supabase_url
from backend.routes import chat, ingest, quiz, code, video
from storage.cloud.client import get_supabase

logging.basicConfig(level=logging.INFO)
settings = get_settings()
app = FastAPI(title='SOLO TUTOR API', version='1.0.0')

# Open CORS for easier frontend integration (Netlify/any origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(chat.router); app.include_router(ingest.router); app.include_router(quiz.router); app.include_router(code.router); app.include_router(video.router)

@app.get('/')
async def root(): return {'status': 'ok', 'message': 'SOLO TUTOR API is running'}

@app.get('/health')
async def health(): return {'status': 'ok', 'version': '1.0.0'}



@app.get('/ready')
async def ready() -> dict[str, Any]:
    supabase_url = get_supabase_url(settings)
    supabase_key = get_supabase_key(settings)
    checks: dict[str, Any] = {
        'supabase_configured': bool(supabase_url and supabase_key),
        'llm_configured': bool(settings.GROK_API_KEY),
        'supabase_connection': False,
        'errors': [],
    }
    if checks['supabase_configured']:
        try:
            # Lightweight query to validate Supabase credentials and table access.
            get_supabase().table('documents').select('doc_id').limit(1).execute()
            checks['supabase_connection'] = True
        except Exception as exc:
            checks['errors'].append(f'supabase: {exc}')
    else:
        checks['errors'].append('supabase: missing SUPABASE_URL or SUPABASE_KEY')

    if not checks['llm_configured']:
        checks['errors'].append('llm: missing GROK_API_KEY')


    status = 'ready' if checks['supabase_connection'] and checks['llm_configured'] else 'degraded'
    return {'status': status, 'checks': checks}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={'error': 'Internal server error', 'detail': str(exc)})
