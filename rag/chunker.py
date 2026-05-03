from langchain_text_splitters import RecursiveCharacterTextSplitter
_splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=64, separators=['\n\n','\n',' ',''])
def chunk_text(text: str, doc_id: str) -> list[dict]:
    return [{'doc_id': doc_id, 'chunk_id': i, 'content': c.strip()} for i, c in enumerate(_splitter.split_text(text)) if len(c.strip()) >= 20]
