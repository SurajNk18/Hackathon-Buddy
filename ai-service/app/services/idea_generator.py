import os
from openai import OpenAI
from app.schemas.ideas import IdeaGenerationRequest

def generate_project_idea(request: IdeaGenerationRequest) -> str:
    # Initialize OpenAI client
    # Assuming OPENAI_API_KEY is loaded in environment variables (e.g. from .env)
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    # Collect all team skills
    all_team_skills = set()
    for member in request.team.members:
        for skill in member.skills:
            all_team_skills.add(skill)
    all_team_skills_list = list(all_team_skills)

    # Format team members text
    team_member_text = ""
    for member in request.team.members:
        team_member_text += f"{member.name}: {', '.join(member.skills)}\n"

    # Construct the prompt
    prompt = f"""
    You are an AI assistant for a hackathon platform called Hackathon Buddy.
    Your task is to generate a hackathon project idea that is SPECIFICALLY suitable for the given team.

    TEAM INFORMATION
    ----------------
    Team Name:
    {request.team.team_name}

    Team Members and Skills:
    {team_member_text}

    Combined Team Skills:
    {', '.join(all_team_skills_list)}

    HACKATHON INFORMATION
    ---------------------
    Hackathon Name:
    {request.hackathon.name}

    Hackathon Theme:
    {request.hackathon.theme}

    Problem Statement:
    {request.hackathon.problem_statement}

    SELECTED DOMAIN
    ---------------
    {request.domain}

    IMPORTANT RULES
    ---------------
    1. The idea MUST be related to the hackathon theme.
    2. The idea MUST be related to the selected domain.
    3. The idea should make strong use of the team's existing skills.
    4. Do not create an unnecessarily complicated project.
    5. Identify skills that are already available in the team.
    6. Identify additional skills that may be required.
    7. The project should be realistic for a student hackathon.
    8. Avoid suggesting technologies that are completely unrelated to the team's current skills unless genuinely necessary.
    9. Explain why the idea is suitable for this team.

    RETURN THE RESULT IN THIS FORMAT:
    PROJECT TITLE:
    <project title>

    PROBLEM:
    <problem being solved>

    SOLUTION:
    <project solution>

    KEY FEATURES:
    1. <feature>
    2. <feature>
    3. <feature>
    4. <feature>

    TECHNOLOGIES:
    <technologies>

    REQUIRED SKILLS:
    <skills required to build the project>

    TEAM SKILLS USED:
    <skills already available in the team>

    MISSING OR ADDITIONAL SKILLS:
    <skills that the team may need>

    TEAM COMPATIBILITY:
    <percentage from 0-100>

    WHY THIS IDEA FITS THE TEAM:
    <short explanation>
    """

    try:
        # Use GPT-4o-mini as a fast/cheap alternative for "gpt-5-mini" (which does not exist yet)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Failed to generate project idea: {str(e)}")
