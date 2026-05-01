from typing import List
from backend.storage.cloud.vectors import search_vectors

async def retrieve(query: str, doc_id: str | None = None) -> List[str]:
    results = await search_vectors(query, doc_id)
    return [result["content"] for result in results]
