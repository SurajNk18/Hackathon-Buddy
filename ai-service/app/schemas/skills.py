from pydantic import BaseModel
from typing import List

class TeamMemberSkillSchema(BaseModel):
    name: str
    skills: List[str]

class TeamSkillSchema(BaseModel):
    team_name: str
    members: List[TeamMemberSkillSchema]

class ProjectRequirementSchema(BaseModel):
    project_title: str
    required_skills: List[str]

class SkillGapRequest(BaseModel):
    team: TeamSkillSchema
    project: ProjectRequirementSchema
    threshold: float = 0.60

class MatchedSkillSchema(BaseModel):
    required_skill: str
    matched_skill: str
    similarity: float
    members: List[str]

class MissingSkillSchema(BaseModel):
    required_skill: str
    best_match: str
    similarity: float

class SkillGapResponse(BaseModel):
    team_name: str
    project_title: str
    total_required_skills: int
    available_skills_count: int
    missing_skills_count: int
    skill_coverage_percentage: float
    available_skills: List[MatchedSkillSchema]
    missing_skills: List[MissingSkillSchema]
