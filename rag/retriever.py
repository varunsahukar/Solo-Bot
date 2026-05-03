from rag.embedder import embed_chunks
from storage.cloud.vectors import search_similar
async def retrieve_context(query: str, doc_id: str = '', top_k: int = 5) -> list[str]:
    try:
        # 1. Try vector search
        vector = embed_chunks([{'doc_id':'query','chunk_id':0,'content':query}])[0]['vector']
        results = await search_similar(vector, doc_id=doc_id, top_k=top_k)
        
        # 2. Fallback: If no results found and we have a doc_id, just get the first few chunks
        if not results and doc_id:
            from storage.cloud.client import get_supabase
            r = get_supabase().table('documents').select('content').eq('doc_id', doc_id).limit(top_k).execute()
            results = [x['content'] for x in (r.data or [])]
            
        return results
    except Exception: return []
