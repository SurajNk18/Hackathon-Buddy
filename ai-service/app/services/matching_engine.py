import math
from typing import List, Dict, Any
from app.schemas.matching import UserProfileSchema, TeammateMatchResult

def calculate_jaccard_similarity(list1: List[str], list2: List[str]) -> float:
    set1 = set(list1)
    set2 = set(list2)
    if not set1 and not set2:
        return 0.0
    intersection = set1.intersection(set2)
    union = set1.union(set2)
    return len(intersection) / len(union)

def score_skills(user: UserProfileSchema, candidate: UserProfileSchema) -> dict:
    user_skills = set([s.lower() for s in user.skillNames])
    candidate_skills = set([s.lower() for s in candidate.skillNames])
    
    if not user_skills and not candidate_skills:
        return {"score": 0.0, "common": [], "complementary": []}
        
    common = user_skills.intersection(candidate_skills)
    complementary = candidate_skills - user_skills
    
    # We want some overlap for communication, but mostly complementary skills for a team
    overlap_ratio = len(common) / max(len(user_skills), 1)
    
    # Score favors candidates who have skills the user lacks, but penalizes if there's ZERO overlap or TOO MUCH overlap
    if overlap_ratio == 0:
        base_score = 0.4 # Need some common ground
    elif overlap_ratio > 0.8:
        base_score = 0.3 # Too similar, need diversity
    else:
        base_score = 1.0 # Good mix
        
    complementary_score = min(len(complementary) / 3, 1.0) # Cap at 3 complementary skills
    
    final_score = (base_score * 0.4) + (complementary_score * 0.6)
    
    # Return original case names
    common_orig = [s for s in candidate.skillNames if s.lower() in common]
    complementary_orig = [s for s in candidate.skillNames if s.lower() in complementary]
    
    return {
        "score": final_score,
        "common": common_orig,
        "complementary": complementary_orig
    }

def score_interests(user: UserProfileSchema, candidate: UserProfileSchema) -> float:
    user_int = [i.lower() for i in user.interests]
    cand_int = [i.lower() for i in candidate.interests]
    
    if not user_int or not cand_int:
        return 0.5 # Neutral if not specified
        
    similarity = calculate_jaccard_similarity(user_int, cand_int)
    # Even a small overlap in interests is great for team bonding
    return min(similarity * 2, 1.0) 

def score_role(user: UserProfileSchema, candidate: UserProfileSchema) -> float:
    user_role = user.preferredRole
    cand_role = candidate.preferredRole
    
    if not user_role or not cand_role:
        return 0.5
        
    user_role = user_role.lower()
    cand_role = cand_role.lower()
    
    # If they want the exact same role, it might cause conflicts (e.g., two frontend devs)
    if user_role == cand_role:
        return 0.2
        
    # Standard complementary roles
    complementary_pairs = [
        ({"frontend", "ui", "ux"}, {"backend", "api", "database", "server"}),
        ({"machine learning", "data", "ai"}, {"backend", "frontend", "fullstack"}),
        ({"design", "product"}, {"frontend", "backend", "fullstack", "developer"})
    ]
    
    for pair1, pair2 in complementary_pairs:
        u_in_1 = any(r in user_role for r in pair1)
        u_in_2 = any(r in user_role for r in pair2)
        c_in_1 = any(r in cand_role for r in pair1)
        c_in_2 = any(r in cand_role for r in pair2)
        
        if (u_in_1 and c_in_2) or (u_in_2 and c_in_1):
            return 1.0 # Perfect match
            
    return 0.7 # Different roles, generally good

def score_experience(user: UserProfileSchema, candidate: UserProfileSchema) -> float:
    user_exp = user.yearsOfExperience or 0
    cand_exp = candidate.yearsOfExperience or 0
    
    # We want people roughly in the same experience bracket to avoid massive imbalances,
    # but a slight difference (mentorship) is fine
    diff = abs(user_exp - cand_exp)
    if diff <= 1:
        return 1.0
    elif diff <= 3:
        return 0.7
    else:
        return 0.4

def generate_reason(skill_data: dict, role_score: float, cand_role: str) -> str:
    reasons = []
    
    if role_score > 0.8 and cand_role:
        reasons.append(f"Their role ({cand_role}) perfectly complements yours.")
        
    comp_skills = skill_data["complementary"]
    if comp_skills:
        skill_str = ", ".join(comp_skills[:2])
        if len(comp_skills) > 2:
            skill_str += " and others"
        reasons.append(f"They bring new skills like {skill_str}.")
        
    if not reasons:
        reasons.append("Good overall profile match.")
        
    return " ".join(reasons)

def match_teammates(user: UserProfileSchema, candidates: List[UserProfileSchema]) -> List[TeammateMatchResult]:
    results = []
    
    for cand in candidates:
        # Calculate individual scores
        skill_data = score_skills(user, cand)
        interest_score = score_interests(user, cand)
        role_score = score_role(user, cand)
        exp_score = score_experience(user, cand)
        
        # Weighted final score
        # 45% skills, 25% role, 20% interests, 10% experience
        final_score = (
            (skill_data["score"] * 0.45) +
            (role_score * 0.25) +
            (interest_score * 0.20) +
            (exp_score * 0.10)
        )
        
        # Scale to 0-100
        score_100 = round(final_score * 100, 1)
        
        reason = generate_reason(skill_data, role_score, cand.preferredRole)
        
        result = TeammateMatchResult(
            userId=cand.userId,
            name=cand.name,
            profilePhotoUrl=cand.profilePhotoUrl,
            preferredRole=cand.preferredRole,
            bio=cand.bio,
            yearsOfExperience=cand.yearsOfExperience or 0,
            projectCount=cand.projectCount or 0,
            skills=cand.skillNames,
            interests=cand.interests,
            compatibilityScore=score_100,
            commonSkills=skill_data["common"],
            complementarySkills=skill_data["complementary"],
            matchReason=reason
        )
        results.append(result)
        
    # Sort by compatibility score descending
    results.sort(key=lambda x: x.compatibilityScore, reverse=True)
    return results
