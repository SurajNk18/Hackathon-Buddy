from fastapi import APIRouter, HTTPException
from app.schemas.matching import MatchTeammatesRequest, MatchTeammatesResponse
from app.services.matching_engine import match_teammates
import logging

router = APIRouter(
    prefix="/api/ml",
    tags=["Matching Engine"]
)

logger = logging.getLogger(__name__)

@router.post("/match-teammates", response_model=MatchTeammatesResponse)
def match_teammates_endpoint(request: MatchTeammatesRequest):
    try:
        logger.info(f"Received matching request for user {request.user.userId} with {len(request.candidates)} candidates")
        
        if not request.candidates:
            return MatchTeammatesResponse(matches=[])
            
        matches = match_teammates(request.user, request.candidates)
        return MatchTeammatesResponse(matches=matches)
        
    except Exception as e:
        logger.error(f"Error in matching engine: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
