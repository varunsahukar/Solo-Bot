from langchain_community.embeddings import HuggingFaceEmbeddings
from backend.config import get_settings

_settings = get_settings()

# Initialize HuggingFace embedder only if HUGGINGFACE_TOKEN is set.
# Using 'sentence-transformers/all-MiniLM-L6-v2' which produces 384-dimension vectors.
_embedder = None
if _settings.HUGGINGFACE_TOKEN.strip():
    try:
        _embedder = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
    except Exception as e:
        print(f"Failed to initialize HuggingFaceEmbeddings: {e}")

def embed_chunks(chunks: list[dict]) -> list[dict]:
    if not chunks:
        return chunks
    
    # If no embedder (token missing or init failed), fall back to plain text without vectors
    if not _embedder:
        for chunk in chunks:
            chunk['vector'] = None
        return chunks
    
    texts = [c['content'] for c in chunks]
    
    try:
        vectors = _embedder.embed_documents(texts)
        for chunk, vec in zip(chunks, vectors):
            chunk['vector'] = vec
    except Exception as e:
        print(f"Embedding Error: {e}")
        # Return None vectors as fallback so the pipeline doesn't crash
        for chunk in chunks:
            chunk['vector'] = None
            
    return chunks



