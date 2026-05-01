import json
from langgraph.graph import StateGraph, END
from agents.state import AgentState
from agents.router import route_task
from agents.chat_agent import run_chat_agent
from agents.quiz_agent import run_quiz_agent
from agents.code_agent import run_code_agent
from agents.video_agent import run_video_agent

def _passthrough(state: AgentState) -> AgentState: return state

graph = StateGraph(AgentState)
graph.add_node('router', _passthrough)
for n, fn in [('chat_agent', run_chat_agent), ('quiz_agent', run_quiz_agent), ('code_agent', run_code_agent), ('video_agent', run_video_agent)]: graph.add_node(n, fn)
graph.set_entry_point('router')
graph.add_conditional_edges('router', route_task, {'chat_agent':'chat_agent','quiz_agent':'quiz_agent','code_agent':'code_agent','video_agent':'video_agent'})
for n in ['chat_agent', 'quiz_agent', 'code_agent', 'video_agent']: graph.add_edge(n, END)
app = graph.compile()

def _build_state(task: str, query: str = '', doc_id: str = '') -> AgentState:
    return AgentState(query=query, task_type=task, doc_id=doc_id, retrieved_chunks=[], answer='', metadata={})

async def run_chat(query: str, doc_id: str) -> dict:
    s = await app.ainvoke(_build_state('chat', query, doc_id)); return {'answer': s['answer'], 'sources': s['retrieved_chunks'][:3], 'chunks_used': len(s['retrieved_chunks'])}

async def run_quiz(doc_id: str, topic: str = '') -> dict:
    s = await app.ainvoke(_build_state('quiz', topic, doc_id)); raw = s['answer'].strip();
    if raw.startswith('```'): raw = raw.split('```')[1].lstrip('json').strip()
    try: questions = json.loads(raw)
    except Exception: questions = []
    return {'questions': questions}

async def run_code(query: str, doc_id: str) -> dict:
    s = await app.ainvoke(_build_state('code', query, doc_id)); return {'answer': s['answer']}

async def run_video(doc_id: str) -> dict:
    s = await app.ainvoke(_build_state('video', '', doc_id)); return {'answer': s['answer']}
