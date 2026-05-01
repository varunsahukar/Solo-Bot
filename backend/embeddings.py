from huggingface_hub import InferenceClient
from backend.config import settings

client = InferenceClient(token=settings.HUGGINGFACE_TOKEN)

async def get_embeddings(text: str) -> list[float]:
    try:
        response = client.feature_extraction(
            text=text,
            model=settings.HUGGINGFACE_EMBEDDING_MODEL
        )
        return response[0] if isinstance(response, list) else response
    except Exception as e:
        raise Exception(f"Embeddings failed: {e}")
