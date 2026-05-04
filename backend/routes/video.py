import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel
from backend.utils.youtube import get_youtube_content
from rag.ingest_pipeline import ingest_document
from agents.graph import run_video

logger = logging.getLogger(__name__)
router = APIRouter(prefix='/api/video')

class YoutubeRequest(BaseModel):
    # Flexible fields to match various frontend naming conventions
    url: Optional[str] = None
    video_url: Optional[str] = None
    youtube_url: Optional[str] = None
    video_id: Optional[str] = None
    doc_id: str

@router.post('/youtube')
async def youtube_transcript_endpoint(req_obj: YoutubeRequest, request: Request, background_tasks: BackgroundTasks):
    # 1. DEBUG LOGGING: Print the raw request
    try:
        raw_body = await request.body()
        logger.info(f"Raw body: {raw_body.decode()}")
        json_body = await request.json()
        logger.info(f"JSON body: {json_body}")
    except Exception as log_err:
        logger.warning(f"Logging failed: {log_err}")

    # 2. Pick the first available URL/ID field
    target_url = req_obj.url or req_obj.video_url or req_obj.youtube_url or req_obj.video_id
    
    if not target_url:
        logger.error("No URL or Video ID provided in request")
        raise HTTPException(status_code=400, detail="Missing URL or Video ID (accepted keys: url, video_url, youtube_url, video_id)")

    try:
        logger.info(f"Processing video request for doc_id: {req_obj.doc_id}")
        
        # 3. Smarter Content Fetch (Metadata + Transcripts)
        text = await get_youtube_content(target_url)

        # 4. Background Ingestion
        background_tasks.add_task(ingest_document, req_obj.doc_id, text, {'source': 'youtube', 'url': target_url})
        
        # 5. Summary Generation
        result = await run_video(req_obj.doc_id, transcript=text)
        
        return {
            'status': 'success', 
            'summary': result['answer'],
            'doc_id': req_obj.doc_id
        }

    except RuntimeError as e:
        logger.error(f"Runtime error during video processing: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error during video processing: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.post('')
async def video_summary_endpoint(req: YoutubeRequest):
    try:
        result = await run_video(req.doc_id)
        return {'summary': result['answer']}
    except Exception as e:
        logger.error(f"Error in video_summary_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
