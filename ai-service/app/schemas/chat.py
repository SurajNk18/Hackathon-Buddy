from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatHistoryItem(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    userContext: Optional[str] = None
    skills: Optional[List[str]] = []
    history: Optional[List[ChatHistoryItem]] = []

class ChatResponse(BaseModel):
    response: str
    provider: str = "hackathon-engine"
    status: str = "success"
