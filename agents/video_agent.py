from agents.state import AgentState
from rag.retriever import retrieve_context
from agents._llm import call_llm

async def run_video_agent(state: AgentState) -> AgentState:
    # Fast path: If text is provided in state, use it directly (up to a reasonable limit)
    text = state.get('metadata', {}).get('transcript', '')
    
    if text:
        # Aggressive truncation for extremely low TPM limits (6k TPM)
        # 15k characters is roughly 4k-5k tokens, fitting within the 6k limit.
        summary_text = text[:15000] 
        prompt = (
            "Summarize the following video transcript in clear sections (Overview, Key Takeaways, Detailed Notes). "
            "Do NOT use markdown bolding (like **Header**). Use plain text for headers. "
            "The output should look like clean documentation.\n\n"
            f"{summary_text}"
        )



    else:
        # Fallback to RAG if no direct text is provided
        chunks = await retrieve_context('key topics summary highlights', doc_id=state.get('doc_id', ''), top_k=15)
        state['retrieved_chunks'] = chunks
        prompt = 'Summarize transcript in sections based on these highlights:\n\n' + '\n\n'.join(chunks)
    
    state['answer'] = await call_llm(prompt)
    return state

