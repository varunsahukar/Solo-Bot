import os
from fastapi.testclient import TestClient
from io import BytesIO

os.environ.setdefault('SUPABASE_URL', 'https://example.supabase.co')
os.environ.setdefault('SUPABASE_KEY', 'test-key')

from main import app
from schemas import ChatRequest, QuizRequest, CodeRequest, VideoRequest


def test_health_endpoint():
    client = TestClient(app)
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_ready_endpoint_shape():
    client = TestClient(app)
    response = client.get('/ready')
    assert response.status_code == 200
    body = response.json()
    assert body['status'] in ('ready', 'degraded')
    assert 'checks' in body
    assert isinstance(body['checks']['errors'], list)


def test_schema_smoke():
    assert ChatRequest(query='hello', doc_id='d1').doc_id == 'd1'
    assert QuizRequest(doc_id='d2').topic == ''
    assert CodeRequest(query='optimize this').doc_id == ''
    assert VideoRequest(doc_id='d3').doc_id == 'd3'


def test_ingest_rejects_unsupported_extension():
    client = TestClient(app)
    file_data = BytesIO(b'binary')
    response = client.post(
        '/api/ingest',
        files={'file': ('bad.exe', file_data, 'application/octet-stream')},
        data={'doc_id': 'd1'},
    )
    assert response.status_code == 400
    assert 'Unsupported file type' in response.json()['detail']


def test_ingest_requires_doc_id():
    client = TestClient(app)
    file_data = BytesIO(b'hello')
    response = client.post(
        '/api/ingest',
        files={'file': ('note.txt', file_data, 'text/plain')},
        data={'doc_id': ' '},
    )
    assert response.status_code == 400
    assert response.json()['detail'] == 'doc_id is required'
