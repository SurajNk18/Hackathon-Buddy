from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_bot import generate_chatbot_response
import logging

router = APIRouter(
    prefix="/api/ml",
    tags=["Chatbot Engine"]
)

logger = logging.getLogger(__name__)

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        logger.info(f"Received chatbot message from user")
        return generate_chatbot_response(request)
    except Exception as e:
        logger.error(f"Error in chatbot generator: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
