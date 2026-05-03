from storage.cloud.vectors import search_similar

async def retrieve_context(query: str, doc_id: str = '', top_k: int = 5) -> list[str]:
    """
    Retrieves context using Full-Text Search.
    """
    try:
        # We pass the raw query string directly to the search function
        results = await search_similar(query, doc_id=doc_id, top_k=top_k)
        
        # Fallback: If no results found and we have a doc_id, just get the first few chunks
        if not results and doc_id:
            from storage.cloud.client import get_supabase
            r = get_supabase().table('documents').select('content').eq('doc_id', doc_id).limit(top_k).execute()
            results = [x['content'] for x in (r.data or [])]
            
        return results
    except Exception:
        return []
