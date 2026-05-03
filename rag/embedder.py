import os
import httpx
import time
from backend.config import get_settings

_settings = get_settings()

# Use HuggingFace Inference API instead of local models for 512MB RAM compatibility
HF_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
HF_TOKEN = _settings.HUGGINGFACE_TOKEN

def embed_chunks(chunks: list[dict]) -> list[dict]:
    if not chunks:
        return chunks
    
    if not HF_TOKEN:
        # Fallback for development if no token is provided
        print("Warning: HUGGINGFACE_TOKEN missing. Skipping embeddings.")
        for chunk in chunks:
            chunk['vector'] = [0.0] * 384
        return chunks

    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    texts = [c['content'] for c in chunks]
    
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(HF_API_URL, headers=headers, json={"inputs": texts, "options": {"wait_for_model": True}})
            response.raise_for_status()
            vectors = response.json()
            
            for chunk, vec in zip(chunks, vectors):
                chunk['vector'] = vec
    except Exception as e:
        print(f"Embedding API Error: {e}")
        # Return fallback zero vectors so the pipeline doesn't crash
        for chunk in chunks:
            chunk['vector'] = [0.0] * 384
            
    return chunks

