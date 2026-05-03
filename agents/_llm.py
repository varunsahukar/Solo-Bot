"""
LLM Client for the Solo Tutor agents.
"""
import logging
import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from backend.config import get_settings

logger = logging.getLogger(__name__)

def _get_groq_client() -> ChatGroq:
    settings = get_settings()
    api_key = settings.GROK_API_KEY.strip()
    if not api_key:
        raise RuntimeError('No GROK_API_KEY found in .env')
    
    return ChatGroq(
        model='llama-3.1-8b-instant', 
        api_key=api_key, 
        temperature=0.3
    )

async def call_llm(prompt: str) -> str:
    try:
        client = _get_groq_client()
        response = await client.ainvoke([HumanMessage(content=prompt)])
        return str(response.content)
    except Exception as exc:
        logger.error('Groq LLM call failed: %s', exc)
        raise RuntimeError(f'LLM request failed: {exc}')

