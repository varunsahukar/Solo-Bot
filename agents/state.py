from typing import TypedDict

class AgentState(TypedDict):
    query: str
    task_type: str
    doc_id: str
    retrieved_chunks: list[str]
    answer: str
    metadata: dict
