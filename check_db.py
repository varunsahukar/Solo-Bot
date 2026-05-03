import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env")
    exit(1)

supabase: Client = create_client(url, key)

try:
    response = supabase.table("documents").select("doc_id", count="exact").execute()
    count = response.count if response.count is not None else len(response.data)
    print(f"Success: Found {count} chunks in the 'documents' table.")
    
    if count > 0:
        unique_docs = set(row['doc_id'] for row in response.data)
        print(f"Unique Document IDs: {list(unique_docs)}")
    else:
        print("Warning: The 'documents' table is empty. Please upload a file via the app.")

except Exception as e:
    print(f"Error querying Supabase: {e}")
    print("Make sure you have run the schema.sql in the Supabase SQL Editor.")
