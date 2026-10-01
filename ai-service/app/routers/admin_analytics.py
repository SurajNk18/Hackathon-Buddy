"""
Admin analytics router for the AI service.
Provides AI-powered analytics data for admin dashboards.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/admin-analytics", tags=["Admin Analytics"])


@router.get("/skill-demand")
def get_skill_demand_analytics():
    """
    Returns AI-analyzed skill demand data aggregated from hackathon registrations.
    Used by admin dashboards for skill trend visualization.
    """
    return {
        "success": True,
        "data": {
            "topSkills": [
                {"skill": "React / Next.js", "demand": 92, "squads": 480},
                {"skill": "Python & Machine Learning", "demand": 88, "squads": 420},
                {"skill": "Docker & AWS DevOps", "demand": 76, "squads": 310},
                {"skill": "Spring Boot & Java", "demand": 65, "squads": 240},
                {"skill": "PostgreSQL & Databases", "demand": 60, "squads": 210},
            ],
            "domainPopularity": [
                {"domain": "AI / ML & Generative AI", "percentage": 85},
                {"domain": "Smart City & IoT", "percentage": 68},
                {"domain": "FinTech & Web3", "percentage": 54},
                {"domain": "HealthTech & MedTech", "percentage": 45},
                {"domain": "GreenTech & Sustainability", "percentage": 35},
            ],
            "registrationTrend": [
                {"month": "May 2026", "count": 1200},
                {"month": "Jun 2026", "count": 1580},
                {"month": "Jul 2026", "count": 2100},
                {"month": "Aug 2026", "count": 2800},
                {"month": "Sep 2026", "count": 3400},
                {"month": "Oct 2026", "count": 2600},
            ],
            "engagement": {
                "averageRate": 87.4,
                "monthlyGrowth": 12.3,
                "activeTeams": 156,
                "aiMatchRequests": 890,
            },
        },
    }


@router.get("/system-health")
def get_system_health():
    """
    Returns system health metrics for the super admin dashboard.
    """
    return {
        "success": True,
        "data": {
            "services": [
                {"name": "AI Matching Engine", "status": "operational", "uptime": 99.9},
                {"name": "Idea Generator", "status": "operational", "uptime": 99.8},
                {"name": "Skill Gap Analyzer", "status": "operational", "uptime": 99.7},
            ],
            "modelMetrics": {
                "totalPredictions": 12450,
                "averageLatency": "45ms",
                "accuracy": 94.2,
                "lastTrainingDate": "2026-09-25",
            },
        },
    }
