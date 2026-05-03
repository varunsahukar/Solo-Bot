import pytesseract
from PIL import Image
import io

def extract_image_text(file_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(file_bytes))
    text = pytesseract.image_to_string(image)
    if not text.strip(): raise ValueError('Image has no extractable text')
    return text.strip()
