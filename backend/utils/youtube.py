import re
import httpx
import logging
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from backend.config import get_settings

logger = logging.getLogger(__name__)

def extract_video_id(url_or_id: str) -> str:
    """
    Extracts the 11-character YouTube video ID from various URL formats or plain ID.
    Supports: watch?v=ID, youtu.be/ID, embed/ID, shorts/ID, or plain ID.
    """
    url_or_id = url_or_id.strip()
    
    # If it's already a plain 11-char ID
    if len(url_or_id) == 11 and re.match(r'^[0-9A-Za-z_-]{11}$', url_or_id):
        return url_or_id

    # Regex for various URL formats
    regex = r'(?:v=|\/|embed\/|shorts\/|youtu\.be\/)([0-9A-Za-z_-]{11})(?:[&?]|$)'
    match = re.search(regex, url_or_id)
    if match: 
        return match.group(1)
    
    raise ValueError(f'Invalid YouTube URL or Video ID: {url_or_id}')

async def get_youtube_metadata(video_id: str) -> dict:
    """
    Step 1: Fetch metadata via YouTube Data API v3.
    """
    settings = get_settings()
    api_key = settings.YOUTUBE_API_KEY
    if not api_key:
        logger.warning("YOUTUBE_API_KEY not set, skipping metadata fetch")
        return {}

    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {"part": "snippet", "id": video_id, "key": api_key}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                if data.get("items"):
                    snippet = data["items"][0]["snippet"]
                    logger.info(f"Successfully fetched metadata for {video_id}")
                    return {
                        "title": snippet.get("title", ""),
                        "description": snippet.get("description", ""),
                    }
            logger.warning(f"YouTube API returned status {response.status_code} for {video_id}")
    except Exception as e:
        logger.error(f"YouTube Data API Error for {video_id}: {e}")
    
    return {}

def get_transcript_only(video_id: str) -> str:
    """
    Step 2: Fetch transcript with priority logic.
    """
    # 1. Try English
    try:
        logger.info(f"Attempting English transcript for {video_id}")
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'en-US', 'en-GB'])
        return ' '.join([t['text'] for t in transcript])
    except (TranscriptsDisabled, NoTranscriptFound):
        logger.info(f"No English transcript for {video_id}, trying auto-generated/other")
    except Exception as e:
        logger.warning(f"Transcript error (Step 2a) for {video_id}: {e}")

    # 2. Try any available
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        # Picks the first one available
        transcript = next(iter(transcript_list)).fetch()
        logger.info(f"Successfully fetched non-English/fallback transcript for {video_id}")
        return ' '.join([t['text'] for t in transcript])
    except Exception as e:
        logger.error(f"All transcript attempts failed for {video_id}: {e}")
        return ""

async def get_youtube_content(url_or_id: str) -> str:
    """
    Priority: Metadata Description -> English Transcript -> Any Transcript.
    """
    logger.info(f"Starting content extraction for: {url_or_id}")
    
    try:
        video_id = extract_video_id(url_or_id)
        logger.info(f"Extracted Video ID: {video_id}")
    except ValueError as e:
        logger.error(str(e))
        raise RuntimeError(str(e))

    # Step A: Metadata
    metadata = await get_youtube_metadata(video_id)
    title = metadata.get("title", "")
    description = metadata.get("description", "")
    
    # Step B: Transcript
    transcript = get_transcript_only(video_id)

    parts = []
    if title:
        parts.append(f"TITLE: {title}")
    
    # Use description if it's substantial
    if len(description) > 200:
        logger.info(f"Using video description as context (>200 chars) for {video_id}")
        clean_desc = description[:1000] + "..." if len(description) > 1000 else description
        parts.append(f"DESCRIPTION: {clean_desc}")
    
    if transcript:
        logger.info(f"Using transcript for {video_id} ({len(transcript)} chars)")
        parts.append(f"TRANSCRIPT: {transcript}")

    if not parts:
        logger.error(f"Failed to retrieve any content for {video_id}")
        raise RuntimeError("Could not retrieve content for this video. It may be private, age-restricted, or have no captions.")

    return "\n\n".join(parts)
