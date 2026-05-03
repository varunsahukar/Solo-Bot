from pydantic import BaseModel, Field
class ChatRequest(BaseModel): query: str; doc_id: str
class ChatResponse(BaseModel): answer: str; sources: list[str] = Field(default_factory=list); chunks_used: int = 0
class IngestResponse(BaseModel): status: str; chunks_stored: int
class QuizRequest(BaseModel): doc_id: str; topic: str = ''
class QuizResponse(BaseModel): questions: list[dict] = Field(default_factory=list)
class CodeRequest(BaseModel): query: str; doc_id: str = ''
class CodeResponse(BaseModel): answer: str
class VideoRequest(BaseModel): doc_id: str
class VideoResponse(BaseModel): summary: str
