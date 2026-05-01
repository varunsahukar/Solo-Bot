from fastapi import APIRouter, UploadFile, File
import uuid
from backend.extractor.text import extract_text
from backend.embeddings import get_embeddings
from backend.storage.cloud.vectors import upsert_vector

router = APIRouter(prefix="/api/files", tags=["files"])

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        doc_id = str(uuid.uuid4())
        content = await file.read()
        text = await extract_text(content, file.filename or "unknown")
        embedding = await get_embeddings(text)
        await upsert_vector(doc_id, embedding, text)
        return {"doc_id": doc_id, "filename": file.filename, "status": "processed"}
    except Exception as e:
        return {"error": str(e), "status": "failed"}
