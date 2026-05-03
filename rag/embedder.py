from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from backend.config import get_settings

_settings = get_settings()

# Use FastEmbed with BAAI/bge-small-en-v1.5 (384 dimensions, ~100MB RAM)
# This model uses ONNX and has NO torch dependency.
_embedder = None
try:
    _embedder = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
except Exception as e:
    print(f"Failed to initialize FastEmbed: {e}")

def embed_chunks(chunks: list[dict]) -> list[dict]:
    if not chunks:
        return chunks
    
    # If no embedder (init failed or too heavy), fall back to plain text without vectors
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




