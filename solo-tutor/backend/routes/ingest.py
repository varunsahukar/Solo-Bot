import os
import tempfile
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from backend.schemas import IngestResponse
from backend.extractor.pdf import extract_pdf_text
from backend.extractor.video import extract_video_text
from rag.ingest_pipeline import ingest_document
router = APIRouter(prefix='/api')
@router.post('/ingest', response_model=IngestResponse)
async def ingest_endpoint(file: UploadFile = File(...), doc_id: str = Form(...)):
    tmp_path = ''
    try:
        if not doc_id.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='doc_id is required')

        content = await file.read(); ext = (file.filename or '').split('.')[-1].lower()
        if ext == 'pdf': text = extract_pdf_text(content)
        elif ext in ('mp4', 'webm'):
            with tempfile.NamedTemporaryFile(suffix=f'.{ext}', delete=False) as f: f.write(content); tmp_path = f.name
            text = await extract_video_text(tmp_path)
        elif ext in ('txt', 'md'): text = content.decode('utf-8', errors='ignore')
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Unsupported file type: .{ext}',
            )
        return IngestResponse(status='ok', chunks_stored=await ingest_document(doc_id, text, {'filename': file.filename}))
    except HTTPException:
        raise
    except Exception as e:
        detail = str(e)
        if detail == 'No chunks produced':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='No usable text found. Upload a file with readable content (at least a few sentences).',
            ) from e
        raise HTTPException(status_code=500, detail=detail)
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
