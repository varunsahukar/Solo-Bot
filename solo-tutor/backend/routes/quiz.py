from fastapi import APIRouter, HTTPException
from backend.schemas import QuizRequest, QuizResponse
from agents.graph import run_quiz
router = APIRouter(prefix='/api')
@router.post('/quiz', response_model=QuizResponse)
async def quiz_endpoint(req: QuizRequest):
    try: return QuizResponse(**(await run_quiz(req.doc_id, req.topic)))
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))
