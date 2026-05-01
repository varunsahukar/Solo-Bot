from fastapi import APIRouter, HTTPException
from backend.schemas import VideoRequest, VideoResponse
from agents.graph import run_video
router = APIRouter(prefix='/api')
@router.post('/video', response_model=VideoResponse)
async def video_endpoint(req: VideoRequest):
    try: return VideoResponse(summary=(await run_video(req.doc_id))['answer'])
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))
