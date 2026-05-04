import re
import httpx
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from backend.config import get_settings

def extract_video_id(url: str) -> str:
    """
    Extracts the 11-character YouTube video ID from various URL formats.
    Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, etc.
    """
    regex = r'(?:v=|\/|embed\/|youtu\.be\/)([0-9A-Za-z_-]{11})(?:[&?]|$)'
    match = re.search(regex, url)
    if not match: 
        raise ValueError('Invalid YouTube URL or Video ID')
    return match.group(1)

async def get_youtube_metadata(video_id: str) -> dict:
    """
    Step 1: Fetch metadata (title, description) via YouTube Data API v3.
    """
    settings = get_settings()
    api_key = settings.YOUTUBE_API_KEY
    if not api_key:
        return {}

    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet",
        "id": video_id,
        "key": api_key
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                if data.get("items"):
                    snippet = data["items"][0]["snippet"]
                    return {
                        "title": snippet.get("title", ""),
                        "description": snippet.get("description", ""),
                        "tags": snippet.get("tags", [])
                    }
    except Exception as e:
        print(f"YouTube Data API Error: {e}")
    
    return {}

def get_transcript_only(video_id: str) -> str:
    """
    Step 2: Fetch transcript with priority: English -> Auto-generated -> Any available.
    """
    try:
        # Priority 1: English
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        except (TranscriptsDisabled, NoTranscriptFound):
            # Priority 2: Auto-generated English variants
            try:
                transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'en-US', 'en-GB'])
            except (TranscriptsDisabled, NoTranscriptFound):
                # Priority 3: Fetch any available
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
                transcript = transcript_list.find_transcript(['en', 'hi', 'es', 'fr', 'ja', 'ko']).fetch()

        return ' '.join([t['text'] for t in transcript])
    except Exception:
        return ""

async def get_youtube_content(url: str) -> str:
    """
    Combines Metadata and Transcript for a smarter fallback strategy.
    Optimized for token efficiency.
    """
    try:
        video_id = extract_video_id(url)
    except ValueError as e:
        raise RuntimeError(str(e))

    # Step 1: Metadata
    metadata = await get_youtube_metadata(video_id)
    title = metadata.get("title", "")
    description = metadata.get("description", "")
    
    # Step 2: Transcript
    transcript = get_transcript_only(video_id)

    # Step 3: Combine logic
    parts = []
    if title:
        parts.append(f"TITLE: {title}")
    
    # If description is meaningful, include it (limit to first 1000 chars for token efficiency)
    if len(description) > 200:
        clean_desc = description[:1000] + "..." if len(description) > 1000 else description
        parts.append(f"DESCRIPTION: {clean_desc}")
    
    if transcript:
        # Keep transcript as primary source, but join into one string
        parts.append(f"TRANSCRIPT: {transcript}")

    # Step 4: Final Output
    if not parts:
        raise RuntimeError("Could not retrieve content for this video. It may be private, age-restricted, or have no captions.")

    return "\n\n".join(parts)
