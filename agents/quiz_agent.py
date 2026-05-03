from agents.state import AgentState
from rag.retriever import retrieve_context
from agents._llm import call_llm

async def run_quiz_agent(state: AgentState) -> AgentState:
    topic = state.get('query') or 'general content'
    chunks = await retrieve_context(topic, doc_id=state.get('doc_id', ''), top_k=10)
    state['retrieved_chunks'] = chunks
    
    prompt = f"""You are a professional examiner. Create a challenging multiple-choice quiz based on the provided context.
Topic: {topic}

Return ONLY a JSON array of 5 questions following this EXACT structure:
[
  {{
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A"
  }}
]

CRITICAL RULES:
1. The "answer" field MUST be a direct, identical copy-paste of one of the items in the "options" array.
2. DO NOT include any prefixes like "A)" or "Correct Answer:" in the "answer" field.
3. Ensure the answer is factually correct based on the context.

Context:
{chr(10).join(chunks)}
"""
    state['answer'] = await call_llm(prompt)
    return state
