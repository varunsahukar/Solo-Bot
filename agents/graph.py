from typing import TypedDict, Annotated, Sequence
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage, HumanMessage
from backend.rag.retriever import retrieve
from backend.llm import get_llm_response
import operator

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    doc_id: str | None

async def agent_node(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    query = last_message.content
    doc_id = state.get("doc_id")
    
    context = await retrieve(query, doc_id)
    context_str = "\n".join(context) if context else ""
    
    prompt = f"Context: {context_str}\n\nUser: {query}\n\nAI:"
    response = await get_llm_response(prompt)
    
    return {"messages": [HumanMessage(content=response)]}

workflow = StateGraph(AgentState)
workflow.add_node("agent", agent_node)
workflow.set_entry_point("agent")
workflow.add_edge("agent", END)

app = workflow.compile()

async def run_agent(message: str, doc_id: str | None = None):
    initial_state = {
        "messages": [HumanMessage(content=message)],
        "doc_id": doc_id
    }
    result = await app.ainvoke(initial_state)
    return result["messages"][-1].content
