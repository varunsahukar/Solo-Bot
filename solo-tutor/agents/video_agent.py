from agents.state import AgentState
from rag.retriever import retrieve_context
from agents._llm import call_llm

async def run_video_agent(state: AgentState) -> AgentState:
    chunks = await retrieve_context('key topics summary highlights', doc_id=state.get('doc_id', ''), top_k=10)
    state['retrieved_chunks'] = chunks
    state['answer'] = await call_llm('Summarize transcript in sections:\n\n' + '\n\n'.join(chunks))
    return state
