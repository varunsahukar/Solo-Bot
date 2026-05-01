async def extract_text(file_content: bytes, filename: str) -> str:
    try:
        if filename.endswith('.txt') or filename.endswith('.md'):
            return file_content.decode('utf-8')
        else:
            return file_content.decode('utf-8', errors='ignore')
    except Exception as e:
        raise Exception(f"Text extraction failed: {e}")
