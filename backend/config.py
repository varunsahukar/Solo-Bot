from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[1]

class Settings(BaseSettings):
    SUPABASE_URL: str = ''
    SUPABASE_KEY: str = ''
    NEXT_PUBLIC_SUPABASE_URL: str = ''
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: str = ''
    GROK_API_KEY: str = ''
    YOUTUBE_API_KEY: str = ''
    ALLOWED_ORIGINS: str = 'http://localhost:5173'




    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / '.env'),
        extra='ignore',
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


def get_supabase_url(settings: Settings) -> str:
    return (settings.SUPABASE_URL or settings.NEXT_PUBLIC_SUPABASE_URL).strip()


def get_supabase_key(settings: Settings) -> str:
    return (settings.SUPABASE_KEY or settings.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).strip()
