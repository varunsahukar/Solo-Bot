from agents.state import AgentState
from rag.retriever import retrieve_context
from agents._llm import call_llm

async def run_quiz_agent(state: AgentState) -> AgentState:
    topic = state.get('query') or 'main topics'
    chunks = await retrieve_context(topic, doc_id=state.get('doc_id', ''), top_k=8)
    state['retrieved_chunks'] = chunks
    prompt = (
        'Generate exactly 5 MCQ in JSON array only: '
        '[{"question":"","options":["A","B","C","D"],"answer":"A"}]\n\n'
        f'Topic: {topic}\n\n'
        + '\n\n'.join(chunks)
    )
    state['answer'] = await call_llm(prompt)
    return state
