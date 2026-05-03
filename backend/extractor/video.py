import os
import subprocess
import tempfile
from faster_whisper import WhisperModel

_model = None

def _get_model():
    global _model
    if _model is None:
        _model = WhisperModel('base', device='cpu', compute_type='int8')
    return _model

async def extract_video_text(file_path: str) -> str:
    actual_path = file_path
    try:
        if file_path.startswith('http'):
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as tmp_file:
                actual_path = tmp_file.name
            subprocess.run(
                ['yt-dlp', '-f', 'bestaudio', '-o', actual_path, file_path],
                check=True,
                capture_output=True,
                text=True,
            )
        segments, _ = _get_model().transcribe(actual_path)
        return ' '.join(segment.text for segment in segments).strip()
    except Exception as exc:
        raise RuntimeError(f'Video extraction failed: {exc}') from exc
    finally:
        if file_path.startswith('http') and os.path.exists(actual_path):
            os.unlink(actual_path)
