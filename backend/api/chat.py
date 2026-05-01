from fastapi import APIRouter
from pydantic import BaseModel
from backend.agents.graph import run_agent

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    doc_id: str | None = None

@router.post("/")
async def chat_endpoint(request: ChatRequest):
    response = await run_agent(request.message, request.doc_id)
    return {"response": response}
