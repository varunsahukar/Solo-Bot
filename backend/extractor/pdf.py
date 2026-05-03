import fitz

def extract_pdf_text(file_bytes: bytes) -> str:
    # Removed OCR fallback (pytesseract) to save 500MB+ RAM and avoid system-level dependencies.
    doc = fitz.open(stream=file_bytes, filetype='pdf')
    if doc.is_encrypted: raise ValueError('PDF is encrypted')
    
    # Direct text extraction (High speed, Low memory)
    text = '\n'.join(page.get_text() for page in doc).strip()
        
    if not text: 
        raise ValueError('No text found in PDF. (OCR is disabled for memory efficiency)')
    return text

