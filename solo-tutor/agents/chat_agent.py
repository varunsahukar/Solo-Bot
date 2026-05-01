from agents.state import AgentState
from rag.retriever import retrieve_context
from agents._llm import call_llm

async def run_chat_agent(state: AgentState) -> AgentState:
    chunks = await retrieve_context(state['query'], doc_id=state.get('doc_id', ''))
    state['retrieved_chunks'] = chunks
    context = '\n\n'.join(chunks) if chunks else 'No context available.'
    state['answer'] = await call_llm(f'You are a study tutor. Use context only.\n\nContext:\n{context}\n\nQuestion: {state["query"]}')
    return state
