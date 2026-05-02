import logging
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from huggingface_hub import InferenceClient
from backend.config import get_settings
logger = logging.getLogger(__name__)

def _get_llm_clients() -> list[ChatOpenAI]:
    settings = get_settings()
    clients: list[ChatOpenAI] = []

    grok_key = settings.GROK_API_KEY.strip()
    if grok_key:
        # Try stable first, then legacy fallback if account/model support differs.
        clients.append(ChatOpenAI(model='grok-2', openai_api_key=grok_key, openai_api_base='https://api.x.ai/v1', temperature=0.3))
        clients.append(ChatOpenAI(model='grok-2-1212', openai_api_key=grok_key, openai_api_base='https://api.x.ai/v1', temperature=0.3))

    openai_key = settings.OPENAI_API_KEY.strip()
    if openai_key:
        clients.append(ChatOpenAI(model='gpt-4o-mini', openai_api_key=openai_key, temperature=0.3))
        clients.append(ChatOpenAI(model='gpt-3.5-turbo', openai_api_key=openai_key, temperature=0.3))

    if not clients:
        raise RuntimeError('No LLM API key found')
    return clients

async def call_llm(prompt: str) -> str:
    settings = get_settings()
    errors: list[str] = []
    for client in _get_llm_clients():
        try:
            return str((await client.ainvoke([HumanMessage(content=prompt)])).content)
        except Exception as exc:
            model_name = getattr(client, 'model_name', 'unknown-model')
            logger.error('LLM call failed for %s: %s', model_name, exc)
            errors.append(f'{model_name}: {exc}')

    hf_token = settings.HUGGINGFACE_TOKEN.strip()
    if hf_token:
        model = settings.HUGGINGFACE_LLM_MODEL.strip() or 'meta-llama/Llama-3.2-1B-Instruct'
        if model == 'google/flan-t5-large': model = 'meta-llama/Llama-3.2-1B-Instruct' # Override bad default
        try:
            client = InferenceClient(model=model, token=hf_token)
            res = client.chat_completion(messages=[{"role": "user", "content": prompt}], max_tokens=300, temperature=0.2)
            generated = res.choices[0].message.content
            if generated:
                return str(generated)
            errors.append(f'huggingface:{model}: empty response')
        except Exception as exc:
            logger.error('LLM call failed for huggingface: %s', exc)
            errors.append(f'huggingface:{model}: {exc}')

    raise RuntimeError(f'LLM request failed: {" | ".join(errors)}')
