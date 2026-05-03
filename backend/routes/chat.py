from fastapi import APIRouter, HTTPException
from backend.schemas import ChatRequest, ChatResponse
from agents.graph import run_chat
router = APIRouter(prefix='/api')
@router.post('/chat', response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try: return ChatResponse(**(await run_chat(req.query, req.doc_id)))
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))
