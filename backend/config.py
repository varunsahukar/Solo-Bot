from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    GROK_API_KEY: str
    OPENAI_API_KEY: str
    HUGGINGFACE_TOKEN: str
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    GROK_BASE_URL: str = "https://api.x.ai/v1"
    GROK_MODEL: str = "grok-beta"
    OPENAI_MODEL: str = "gpt-4o-mini"
    HUGGINGFACE_EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    class Config:
        env_file = ".env"

settings = Settings()
