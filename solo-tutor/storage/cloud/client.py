from supabase import create_client, Client
from backend.config import get_settings, get_supabase_key, get_supabase_url
_client: Client | None = None
def get_supabase() -> Client:
    global _client
    if _client is None:
        s = get_settings()
        supabase_url = get_supabase_url(s)
        supabase_key = get_supabase_key(s)
        if not supabase_url or not supabase_key:
            raise RuntimeError('Missing SUPABASE_URL or SUPABASE_KEY in environment')
        _client = create_client(supabase_url, supabase_key)
    return _client
