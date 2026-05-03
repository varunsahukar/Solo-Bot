import os
import re
import sys
import subprocess
import json
import tempfile
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

def extract_video_id(url: str) -> str:
    regex = r'(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?]|$)'
    match = re.search(regex, url)
    if not match: 
        raise ValueError('Could not find a valid 11-character video ID in the URL.')
    return match.group(1)

def get_youtube_transcript(url: str) -> str:
    video_id = extract_video_id(url)
    # Normalize URL to avoid tracking params or shortened URL issues
    normalized_url = f"https://www.youtube.com/watch?v={video_id}"
    
    # Method 1: Standard API
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'hi'])

        return ' '.join([t['text'] for t in transcript])
    except (TranscriptsDisabled, NoTranscriptFound):
        pass # Fallback to Method 2
    except Exception as e:
        if "no element found" not in str(e).lower():
            raise RuntimeError(f'YouTube Error: {str(e)}')

    # Method 2: yt-dlp Fallback (More robust against rate limits/blocks)
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            cmd = [
                sys.executable, '-m', 'yt_dlp',
                '--skip-download',
                '--no-playlist',
                '--write-auto-subs',
                '--write-subs',
                '--sub-lang', 'en,hi',
                '--sub-format', 'vtt/srt',
                '--no-check-certificate',
                '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                '--output', f'{tmpdir}/sub',
                normalized_url
            ]

            # Use check=False to handle cases where yt-dlp returns 1 but still gets some subs
            result = subprocess.run(cmd, capture_output=True, text=True, check=False)
            
            if result.returncode != 0:
                # Log error but continue to check if file was created
                print(f"yt-dlp warning (exit {result.returncode}): {result.stderr}")
            
            # Find the generated subtitle file
            sub_file = None
            for f in os.listdir(tmpdir):
                if f.startswith('sub.') and (f.endswith('.vtt') or f.endswith('.srt')):
                    sub_file = os.path.join(tmpdir, f)
                    break
            
            if sub_file:
                with open(sub_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Simple regex to strip VTT/SRT tags
                    clean_text = re.sub(r'<[^>]+>', '', content) # Strip HTML tags
                    clean_text = re.sub(r'\d{2}:\d{2}:\d{2}.\d{3} --> \d{2}:\d{2}:\d{2}.\d{3}', '', clean_text) # Strip timestamps
                    clean_text = re.sub(r'^\d+$', '', clean_text, flags=re.MULTILINE) # Strip SRT line numbers
                    return ' '.join(clean_text.split())
            
            if result.returncode != 0:
                raise RuntimeError(f'yt-dlp failed: {result.stderr[:200]}')
    except Exception as e:
        raise RuntimeError(f'Failed to extract transcript even with fallback: {str(e)}')


    raise RuntimeError('No subtitles found for this video. Please ensure the video has CC enabled.')
