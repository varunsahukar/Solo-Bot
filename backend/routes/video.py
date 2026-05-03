from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from backend.utils.youtube import get_youtube_transcript
from rag.ingest_pipeline import ingest_document
from agents.graph import run_video

router = APIRouter(prefix='/api/video')

class YoutubeRequest(BaseModel):
    url: str
    doc_id: str

@router.post('/youtube')
async def youtube_transcript_endpoint(req: YoutubeRequest, background_tasks: BackgroundTasks):
    try:
        # 1. Fast Fetch (Offloaded to thread pool to avoid blocking event loop)
        text = await run_in_threadpool(get_youtube_transcript, req.url)

        
        # 2. Background Ingestion (non-blocking)
        background_tasks.add_task(ingest_document, req.doc_id, text, {'source': 'youtube', 'url': req.url})
        
        # 3. Fast Summary (Immediate)
        # We pass the transcript directly to trigger the 'fast path' in the agent
        result = await run_video(req.doc_id, transcript=text)
        
        return {
            'status': 'success', 
            'summary': result['answer'],
            'doc_id': req.doc_id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('')
async def video_summary_endpoint(req: YoutubeRequest):
    # Fallback/Refresh summary if needed
    try:
        result = await run_video(req.doc_id)
        return {'summary': result['answer']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

