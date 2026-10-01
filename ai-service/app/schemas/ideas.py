from pydantic import BaseModel
from typing import List

class TeamMemberSchema(BaseModel):
    name: str
    skills: List[str]

class TeamSchema(BaseModel):
    team_name: str
    members: List[TeamMemberSchema]

class HackathonSchema(BaseModel):
    name: str
    theme: str
    problem_statement: str

class IdeaGenerationRequest(BaseModel):
    team: TeamSchema
    hackathon: HackathonSchema
    domain: str

class IdeaGenerationResponse(BaseModel):
    idea: str
