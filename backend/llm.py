from openai import AsyncOpenAI
from backend.config import settings

async def get_llm_response(prompt: str) -> str:
    try:
        client = AsyncOpenAI(
            api_key=settings.GROK_API_KEY,
            base_url=settings.GROK_BASE_URL
        )
        response = await client.chat.completions.create(
            model=settings.GROK_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as grok_error:
        try:
            client = AsyncOpenAI(
                api_key=settings.OPENAI_API_KEY
            )
            response = await client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as openai_error:
            raise Exception(f"LLM failed: {grok_error}, {openai_error}")
