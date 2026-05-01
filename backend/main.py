from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import chat, files
from backend.config import settings

app = FastAPI(title="SOLO TUTOR API")

origins = settings.ALLOWED_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(files.router)

@app.get("/")
async def root():
    return {"message": "Welcome to SOLO TUTOR API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
