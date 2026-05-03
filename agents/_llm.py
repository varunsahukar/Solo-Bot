"""
LLM Client for the Solo Tutor agents.
"""
import logging

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from backend.config import get_settings
logger = logging.getLogger(__name__)

def _get_llm_client() -> ChatOpenAI:
    settings = get_settings()
    grok_key = settings.GROK_API_KEY.strip()
    if not grok_key:
        raise RuntimeError('No Groq API key found in .env')
    
    # Using Llama-3.1-8b-instant via Groq for high speed and higher rate limits
    return ChatOpenAI(
        model='llama-3.1-8b-instant', 
        openai_api_key=grok_key, 
        openai_api_base='https://api.groq.com/openai/v1', 
        temperature=0.3
    )


async def call_llm(prompt: str) -> str:
    try:
        client = _get_llm_client()
        response = await client.ainvoke([HumanMessage(content=prompt)])
        return str(response.content)
    except Exception as exc:
        logger.error('Groq LLM call failed: %s', exc)
        raise RuntimeError(f'LLM request failed: {exc}')
