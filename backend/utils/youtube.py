import re
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

def extract_video_id(url: str) -> str:
    """
    Extracts the 11-character YouTube video ID from various URL formats.
    """
    regex = r'(?:v=|\/|embed\/|youtu\.be\/)([0-9A-Za-z_-]{11})(?:[&?]|$)'
    match = re.search(regex, url)
    if not match: 
        raise ValueError('Could not find a valid 11-character video ID in the URL.')
    return match.group(1)

def get_youtube_transcript(url: str) -> str:
    """
    Fetches the transcript using youtube-transcript-api.
    Only uses the official API method to avoid bot detection and external dependencies.
    """
    try:
        video_id = extract_video_id(url)
    except ValueError as e:
        raise RuntimeError(str(e))

    try:
        # Try to get English transcript first, fall back to any available
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        except (TranscriptsDisabled, NoTranscriptFound):
            # Fallback to fetching all available and picking the first one
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            transcript = transcript_list.find_transcript(['en', 'hi', 'es', 'fr']).fetch()

        return ' '.join([t['text'] for t in transcript])
    
    except (TranscriptsDisabled, NoTranscriptFound):
        raise RuntimeError('Transcript not available for this video')
    except Exception as e:
        # Check for specific bot/sign-in errors and simplify the message
        error_msg = str(e).lower()
        if "sign in" in error_msg or "bot" in error_msg:
            raise RuntimeError('YouTube is blocking requests. Please try again later.')
        raise RuntimeError(f'YouTube Error: {str(e)}')
