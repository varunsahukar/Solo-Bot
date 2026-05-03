from agents.state import AgentState
from rag.retriever import retrieve_context
from agents._llm import call_llm

async def run_chat_agent(state: AgentState) -> AgentState:
    chunks = await retrieve_context(state['query'], doc_id=state.get('doc_id', ''))
    state['retrieved_chunks'] = chunks
    
    if chunks:
        context = '\n\n'.join(chunks)
        prompt = f"""You are a helpful AI study tutor. Your goal is to explain the document data clearly.
Use the following context from the user's document to answer their question.
If the answer is not in the context, try to answer based on general knowledge but mention that it's not in the document.

Context:
{context}

Question: {state["query"]}
"""
    else:
        prompt = f"The user is asking about a document, but no specific context was found. If you have any general knowledge about '{state['query']}', provide a brief helpful response, otherwise ask them to upload a more detailed document.\n\nQuestion: {state['query']}"
    
    state['answer'] = await call_llm(prompt)
    return state
