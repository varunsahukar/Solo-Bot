CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id text NOT NULL,
  chunk_id integer NOT NULL,
  content text NOT NULL,
  embedding vector(384),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(doc_id, chunk_id)
);
CREATE INDEX IF NOT EXISTS documents_embedding_idx ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(384), 
  match_threshold float DEFAULT 0.3, 
  match_count int DEFAULT 5,
  filter_doc_id text DEFAULT NULL
)
RETURNS TABLE(id uuid, doc_id text, content text, similarity float)
LANGUAGE sql STABLE AS $$
  SELECT id, doc_id, content, 1 - (embedding <=> query_embedding) AS similarity
  FROM documents 
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
    AND (filter_doc_id IS NULL OR documents.doc_id = filter_doc_id)
  ORDER BY similarity DESC LIMIT match_count;
$$;
