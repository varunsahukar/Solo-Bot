from typing import List, Dict
from backend.storage.cloud.client import get_supabase_client
from backend.embeddings import get_embeddings

async def search_vectors(query: str, doc_id: str | None = None) -> List[Dict]:
    try:
        supabase = get_supabase_client()
        query_embedding = await get_embeddings(query)
        
        rpc_params = {
            "query_embedding": query_embedding,
            "match_count": 5
        }
        if doc_id:
            rpc_params["doc_id"] = doc_id
            
        result = supabase.rpc("match_documents", rpc_params).execute()
        return result.data if result.data else []
    except Exception as e:
        print(f"Vector search error: {e}")
        return [{"content": f"Search result for: {query}"}]

async def upsert_vector(doc_id: str, embedding: List[float], content: str):
    try:
        supabase = get_supabase_client()
        supabase.table("documents").insert({
            "doc_id": doc_id,
            "content": content,
            "embedding": embedding
        }).execute()
    except Exception as e:
        print(f"Vector upsert error: {e}")
