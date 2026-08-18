from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Hackathon Buddy AI Service", version="1.0.0")

# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Hackathon Buddy AI Service"}

@app.get("/health")
def health_check():
    return {"status": "up", "service": "ai-service"}

from app.routers import matching

app.include_router(matching.router)
