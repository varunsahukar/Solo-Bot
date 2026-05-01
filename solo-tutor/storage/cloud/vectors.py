import logging
from storage.cloud.client import get_supabase
logger = logging.getLogger(__name__)
async def upsert_embedding(doc_id: str, chunk_id: int, content: str, vector: list[float], metadata: dict) -> None:
    try: get_supabase().table('documents').upsert({'doc_id':doc_id,'chunk_id':chunk_id,'content':content,'embedding':vector,'metadata':metadata}, on_conflict='doc_id,chunk_id').execute()
    except Exception as e: logger.error('upsert_embedding failed: %s', e); raise
async def search_similar(query_vector: list[float], doc_id: str = '', top_k: int = 5) -> list[str]:
    try:
        r = get_supabase().rpc('match_documents', {'query_embedding':query_vector,'match_threshold':0.3,'match_count':top_k}).execute()
        rows = r.data or []
        if doc_id:
            rows = [row for row in rows if row.get('doc_id') == doc_id]
        return [x['content'] for x in rows]
    except Exception as e: logger.error('search_similar failed: %s', e); return []
