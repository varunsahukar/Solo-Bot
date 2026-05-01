import fitz

def extract_pdf_text(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype='pdf')
    if doc.is_encrypted: raise ValueError('PDF is encrypted')
    text = '\n'.join(page.get_text() for page in doc).strip()
    if not text: raise ValueError('PDF has no extractable text')
    return text
