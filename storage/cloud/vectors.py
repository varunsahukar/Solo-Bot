import logging
from storage.cloud.client import get_supabase

logger = logging.getLogger(__name__)

async def upsert_embedding(doc_id: str, chunk_id: int, content: str, vector: list[float] | None, metadata: dict) -> None:
    try:
        # Vector is ignored, we only store text for full-text search
        get_supabase().table('documents').upsert({
            'doc_id': doc_id,
            'chunk_id': chunk_id,
            'content': content,
            'metadata': metadata
        }, on_conflict='doc_id,chunk_id').execute()
    except Exception as e:
        logger.error('upsert_text failed: %s', e)
        raise

async def search_similar(query: str, doc_id: str = '', top_k: int = 5) -> list[str]:
    """
    Uses PostgreSQL Full-Text Search instead of vector similarity.
    """
    try:
        query_builder = get_supabase().table('documents').select('content')
        
        if doc_id:
            query_builder = query_builder.eq('doc_id', doc_id)
        
        # Use full-text search on the 'content' column
        r = query_builder.text_search('content', query).limit(top_k).execute()
        
        return [x['content'] for x in (r.data or [])]
    except Exception as e:
        logger.error('full-text search failed: %s', e)
        # Fallback to simple ILIKE search if text_search fails (e.g. index not ready)
        try:
            r = get_supabase().table('documents').select('content').ilike('content', f'%{query}%').limit(top_k).execute()
            return [x['content'] for x in (r.data or [])]
        except Exception:
            return []
