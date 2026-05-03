import fitz
import pytesseract
from PIL import Image
import io

def extract_pdf_text(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype='pdf')
    if doc.is_encrypted: raise ValueError('PDF is encrypted')
    
    # Try direct text extraction first
    text = '\n'.join(page.get_text() for page in doc).strip()
    
    # If no text found, try OCR on each page
    if not text:
        ocr_text_parts = []
        for page in doc:
            # Render page to image (pixmap)
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # Use 2x zoom for better OCR
            img_data = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_data))
            ocr_text_parts.append(pytesseract.image_to_string(img))
        text = '\n'.join(ocr_text_parts).strip()
        
    if not text: raise ValueError('PDF has no extractable text (even with OCR)')
    return text
