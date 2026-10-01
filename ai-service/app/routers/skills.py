from fastapi import APIRouter, HTTPException
from app.schemas.skills import SkillGapRequest, SkillGapResponse
from app.services.skill_gap_analyzer import analyze_skill_gap
import logging

router = APIRouter(
    prefix="/api/ml",
    tags=["Skills Engine"]
)

logger = logging.getLogger(__name__)

@router.post("/analyze-skill-gap", response_model=SkillGapResponse)
def analyze_skill_gap_endpoint(request: SkillGapRequest):
    try:
        logger.info(f"Received skill gap analysis request for team: {request.team.team_name} and project: {request.project.project_title}")
        
        response = analyze_skill_gap(request)
        return response
        
    except Exception as e:
        logger.error(f"Error in skill gap analyzer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
