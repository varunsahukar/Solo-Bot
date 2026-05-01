import os
import torch
from sentence_transformers import SentenceTransformer
from backend.config import get_settings
_device = 'cuda' if torch.cuda.is_available() else 'cpu'
_settings = get_settings()
if _settings.HUGGINGFACE_TOKEN:
    os.environ['HF_TOKEN'] = _settings.HUGGINGFACE_TOKEN
    os.environ['HUGGINGFACEHUB_API_TOKEN'] = _settings.HUGGINGFACE_TOKEN
_model = SentenceTransformer('all-MiniLM-L6-v2', device=_device, token=_settings.HUGGINGFACE_TOKEN or None)
def embed_chunks(chunks: list[dict]) -> list[dict]:
    if not chunks: return chunks
    vectors = _model.encode([c['content'] for c in chunks], batch_size=32, show_progress_bar=False)
    for chunk, vec in zip(chunks, vectors): chunk['vector'] = vec.tolist()
    return chunks
