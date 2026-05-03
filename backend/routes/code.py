from fastapi import APIRouter, HTTPException
from backend.schemas import CodeRequest, CodeResponse
from agents.graph import run_code
router = APIRouter(prefix='/api')
@router.post('/code', response_model=CodeResponse)
async def code_endpoint(req: CodeRequest):
    try: return CodeResponse(**(await run_code(req.query, req.doc_id)))
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))
