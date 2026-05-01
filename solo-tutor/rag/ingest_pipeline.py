from rag.chunker import chunk_text
from rag.embedder import embed_chunks
from storage.cloud.vectors import upsert_embedding
async def ingest_document(doc_id: str, text: str, metadata: dict | None = None) -> int:
    metadata = metadata or {}
    chunks = embed_chunks(chunk_text(text, doc_id))
    if not chunks: raise RuntimeError('No chunks produced')
    for c in chunks: await upsert_embedding(c['doc_id'], c['chunk_id'], c['content'], c['vector'], metadata)
    return len(chunks)
