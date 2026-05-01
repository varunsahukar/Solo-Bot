from rag.embedder import embed_chunks
from storage.cloud.vectors import search_similar
async def retrieve_context(query: str, doc_id: str = '', top_k: int = 5) -> list[str]:
    try:
        vector = embed_chunks([{'doc_id':'query','chunk_id':0,'content':query}])[0]['vector']
        return await search_similar(vector, doc_id=doc_id, top_k=top_k)
    except Exception: return []
