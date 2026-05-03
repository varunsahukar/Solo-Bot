import os
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from backend.config import get_settings

_settings = get_settings()

# Use FastEmbed for free, local, and fast embeddings without API tokens
# Model 'BAAI/bge-small-en-v1.5' is very lightweight (~100MB) and fits in 512MB RAM
_embedder = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")

def embed_chunks(chunks: list[dict]) -> list[dict]:
    if not chunks:
        return chunks
    
    texts = [c['content'] for c in chunks]
    
    try:
        vectors = _embedder.embed_documents(texts)
        for chunk, vec in zip(chunks, vectors):
            chunk['vector'] = vec
    except Exception as e:
        print(f"Embedding Error: {e}")
        # Return fallback zero vectors so the pipeline doesn't crash
        # BGE-small has 384 dimensions
        for chunk in chunks:
            chunk['vector'] = [0.0] * 384
            
    return chunks


