import os
import subprocess
import tempfile

# Removed local faster-whisper to save 1GB+ RAM. 
# YouTube videos are handled via youtube-transcript-api in backend/utils/youtube.py.
# Local video files now require embedded metadata or external transcription APIs.

async def extract_video_text(file_path: str) -> str:
    # This extractor is now simplified to avoid heavy memory usage.
    # We prioritize youtube-transcript-api (cloud) over local transcription.
    try:
        if file_path.startswith('http'):
            # For YouTube, we should use the utility that doesn't download the video
            from backend.utils.youtube import get_youtube_transcript
            return get_youtube_transcript(file_path)
            
        raise ValueError("Local video transcription is disabled for memory efficiency. Please use YouTube links.")
    except Exception as exc:
        raise RuntimeError(f'Video extraction failed: {exc}') from exc

