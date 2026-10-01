from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Tuple
import pandas as pd

def compute_tfidf_similarity(user_skills_str: str, candidate_skills_list: List[str]) -> List[float]:
    """
    Computes cosine similarity between user skills and a list of candidates' skills using TF-IDF.
    """
    if not user_skills_str or not candidate_skills_list:
        return [0.0] * len(candidate_skills_list)
        
    # We add user skills at the beginning to fit the vectorizer on all vocabularies
    all_texts = [user_skills_str] + candidate_skills_list
    
    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        # User vector is the first one
        user_vector = tfidf_matrix[0]
        candidates_matrix = tfidf_matrix[1:]
        
        # Calculate cosine similarity
        similarity_scores = cosine_similarity(user_vector, candidates_matrix)
        
        # Return the scores for candidates
        return similarity_scores[0].tolist()
    except ValueError:
        # Happens if vocab is empty or all stop words
        return [0.0] * len(candidate_skills_list)

def recommend_top_candidates(user_skills: List[str], candidates: List[dict], top_n: int = 5) -> List[Tuple[dict, float]]:
    """
    Simulates the logic from the user's notebook to recommend top candidates based on skills.
    `candidates` is a list of dicts with at least a 'skills' key (which is a list or comma-separated string).
    """
    user_skills_str = ", ".join(user_skills)
    
    # Extract skills for each candidate
    candidate_skills_strs = []
    for cand in candidates:
        skills = cand.get("skills", [])
        if isinstance(skills, list):
            candidate_skills_strs.append(", ".join(skills))
        else:
            candidate_skills_strs.append(str(skills))
            
    scores = compute_tfidf_similarity(user_skills_str, candidate_skills_strs)
    
    # Combine scores with candidates
    scored_candidates = list(zip(candidates, scores))
    
    # Sort by score descending
    scored_candidates.sort(key=lambda x: x[1], reverse=True)
    
    return scored_candidates[:top_n]
