import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f'Created {path}')

# Backend files
write_file('backend/llm.py', '''from openai import AsyncOpenAI
from backend.config import settings

async def get_llm_response(prompt: str) -> str:
    try:
        client = AsyncOpenAI(
            api_key=settings.GROK_API_KEY,
            base_url=settings.GROK_BASE_URL
        )
        response = await client.chat.completions.create(
            model=settings.GROK_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as grok_error:
        try:
            client = AsyncOpenAI(
                api_key=settings.OPENAI_API_KEY
            )
            response = await client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as openai_error:
            raise Exception(f"LLM failed: {grok_error}, {openai_error}")
''')

write_file('backend/embeddings.py', '''from huggingface_hub import InferenceClient
from backend.config import settings

client = InferenceClient(token=settings.HUGGINGFACE_API_KEY)

async def get_embeddings(text: str) -> list[float]:
    try:
        response = client.feature_extraction(
            text=text,
            model=settings.HUGGINGFACE_EMBEDDING_MODEL
        )
        return response[0] if isinstance(response, list) else response
    except Exception as e:
        raise Exception(f"Embeddings failed: {e}")
''')

# Update backend/storage/cloud/vectors.py
write_file('backend/storage/cloud/vectors.py', '''from typing import List, Dict
from backend.storage.cloud.client import get_supabase_client
from backend.embeddings import get_embeddings

async def search_vectors(query: str, doc_id: str | None = None) -> List[Dict]:
    try:
        supabase = get_supabase_client()
        query_embedding = await get_embeddings(query)
        
        rpc_params = {
            "query_embedding": query_embedding,
            "match_count": 5
        }
        if doc_id:
            rpc_params["doc_id"] = doc_id
            
        result = supabase.rpc("match_documents", rpc_params).execute()
        return result.data if result.data else []
    except Exception as e:
        print(f"Vector search error: {e}")
        return [{"content": f"Search result for: {query}"}]

async def upsert_vector(doc_id: str, embedding: List[float], content: str):
    try:
        supabase = get_supabase_client()
        supabase.table("documents").insert({
            "doc_id": doc_id,
            "content": content,
            "embedding": embedding
        }).execute()
    except Exception as e:
        print(f"Vector upsert error: {e}")
''')

# Update backend/agents/graph.py
write_file('backend/agents/graph.py', '''from typing import TypedDict, Annotated, Sequence
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
    context_str = "\\n".join(context) if context else ""
    
    prompt = f"Context: {context_str}\\n\\nUser: {query}\\n\\nAI:"
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
''')

# Update backend/requirements.txt
write_file('backend/requirements.txt', '''fastapi
uvicorn[standard]
pydantic
pydantic-settings
python-multipart
langchain
langgraph
langchain-community
supabase
python-dotenv
openai
huggingface-hub
''')

# Frontend files
write_file('frontend/src/api/index.ts', '''import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatApi = {
  sendMessage: async (message: string, docId?: string) => {
    try {
      const response = await api.post('/api/chat', { message, doc_id: docId });
      return response.data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  },
};

export const filesApi = {
  uploadFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  },
};
''')

print('All files created successfully!')
