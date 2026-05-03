def embed_chunks(chunks: list[dict]) -> list[dict]:
    """
    Stubbed embedder. Embeddings are disabled to save memory on Render.
    """
    for chunk in chunks:
        chunk['vector'] = None
    return chunks
