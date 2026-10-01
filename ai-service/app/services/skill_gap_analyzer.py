from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from app.schemas.skills import (
    SkillGapRequest, 
    SkillGapResponse, 
    MatchedSkillSchema, 
    MissingSkillSchema
)
import logging

logger = logging.getLogger(__name__)

# Load model globally to avoid loading it on every request
logger.info("Loading SentenceTransformer model 'all-MiniLM-L6-v2'...")
try:
    model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    logger.error(f"Failed to load embedding model: {e}")
    model = None

def find_skill_owners(team_members: list, skill: str) -> list:
    owners = []
    for member in team_members:
        member_skills = [s.lower().strip() for s in member.skills]
        if skill.lower().strip() in member_skills:
            owners.append(member.name)
    return owners

def analyze_skill_gap(request: SkillGapRequest) -> SkillGapResponse:
    if not model:
        raise Exception("Embedding model is not loaded. Cannot perform skill gap analysis.")

    # 1. Collect all team skills
    team_skills = []
    for member in request.team.members:
        for skill in member.skills:
            if skill not in team_skills:
                team_skills.append(skill)
                
    if not team_skills:
        raise Exception("Team has no skills to analyze.")

    # 2. Get required skills
    required_skills = request.project.required_skills
    if not required_skills:
        raise Exception("Project has no required skills.")

    # 3. Create embeddings
    team_embeddings = model.encode(team_skills)
    required_embeddings = model.encode(required_skills)

    # 4. Calculate cosine similarity
    similarity_matrix = cosine_similarity(required_embeddings, team_embeddings)

    # 5. Find the best team match for each required skill
    skill_matches = []
    for i, required_skill in enumerate(required_skills):
        scores = similarity_matrix[i]
        best_index = scores.argmax()
        best_team_skill = team_skills[best_index]
        best_score = float(scores[best_index])

        skill_matches.append({
            "required_skill": required_skill,
            "matched_team_skill": best_team_skill,
            "similarity": best_score
        })

    # 6. Classify Required Skills based on Threshold
    available_skills = []
    missing_skills = []

    for match in skill_matches:
        required_skill = match["required_skill"]
        matched_skill = match["matched_team_skill"]
        similarity = match["similarity"]

        if similarity >= request.threshold:
            owners = find_skill_owners(request.team.members, matched_skill)
            available_skills.append(MatchedSkillSchema(
                required_skill=required_skill,
                matched_skill=matched_skill,
                similarity=similarity,
                members=owners
            ))
        else:
            missing_skills.append(MissingSkillSchema(
                required_skill=required_skill,
                best_match=matched_skill,
                similarity=similarity
            ))

    # 7. Calculate Skill Coverage
    total_required = len(required_skills)
    total_available = len(available_skills)
    total_missing = len(missing_skills)

    coverage = (total_available / total_required) * 100 if total_required > 0 else 0

    return SkillGapResponse(
        team_name=request.team.team_name,
        project_title=request.project.project_title,
        total_required_skills=total_required,
        available_skills_count=total_available,
        missing_skills_count=total_missing,
        skill_coverage_percentage=round(coverage, 2),
        available_skills=available_skills,
        missing_skills=missing_skills
    )
