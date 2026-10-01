from fastapi import APIRouter, HTTPException
from app.schemas.ideas import IdeaGenerationRequest, IdeaGenerationResponse
from app.services.idea_generator import generate_project_idea
import logging

router = APIRouter(
    prefix="/api/ml",
    tags=["Ideas Engine"]
)

logger = logging.getLogger(__name__)

@router.post("/generate-idea", response_model=IdeaGenerationResponse)
def generate_idea_endpoint(request: IdeaGenerationRequest):
    try:
        logger.info(f"Received idea generation request for team: {request.team.team_name}")
        
        idea = generate_project_idea(request)
        return IdeaGenerationResponse(idea=idea)
        
    except Exception as e:
        logger.error(f"Error in idea generator: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
