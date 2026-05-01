from agents.state import AgentState
from rag.retriever import retrieve_context
from agents._llm import call_llm

async def run_code_agent(state: AgentState) -> AgentState:
    chunks = await retrieve_context(state['query'], doc_id=state.get('doc_id', '')) if state.get('doc_id') else []
    state['retrieved_chunks'] = chunks
    state['answer'] = await call_llm(f'Request: {state["query"]}\n\nContext: {chr(10).join(chunks)}')
    return state
