import os
import json
import logging
import requests
from typing import List, Dict, Any, Optional
from app.schemas.chat import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Hackathon Buddy AI — an elite hackathon copilot, technical architect, and team strategist.
Your mission is to help participants build winning hackathon projects, form balanced teams, select optimal tech stacks, solve architectural bottlenecks, and prepare prize-winning pitches.
Keep your answers structured, encouraging, technically accurate, and focused on rapid hackathon execution."""

def generate_chatbot_response(request: ChatRequest) -> ChatResponse:
    message = (request.message or "").strip()
    if not message:
        return ChatResponse(
            response="Hi there! I am your Hackathon Buddy AI Copilot. How can I assist you with your hackathon, project ideas, team formation, or tech stack today?",
            provider="hackathon-engine",
            status="success"
        )

    skills_str = ", ".join(request.skills) if request.skills else "React, Spring Boot, Python, MySQL"
    user_context = request.userContext or f"Hackathon participant with skills: {skills_str}"

    # 1. Try OpenAI if OPENAI_API_KEY is configured
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_key, timeout=12.0)
            messages = [{"role": "system", "content": f"{SYSTEM_PROMPT}\n\nUser Context: {user_context}"}]
            
            if request.history:
                for h in request.history[-6:]:
                    messages.append({"role": "user" if h.role == "user" else "assistant", "content": h.content})

            messages.append({"role": "user", "content": message})

            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
                max_tokens=800
            )
            reply = completion.choices[0].message.content.strip()
            if reply:
                return ChatResponse(response=reply, provider="openai", status="success")
        except Exception as e:
            logger.warning(f"OpenAI API call failed or timed out: {e}")

    # 2. Try Gemini if GEMINI_API_KEY is configured
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {
                "systemInstruction": {"parts": [{"text": f"{SYSTEM_PROMPT}\nUser Context: {user_context}"}]},
                "contents": [{"parts": [{"text": message}]}],
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 800}
            }
            resp = requests.post(url, json=payload, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                reply = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                if reply:
                    return ChatResponse(response=reply, provider="gemini", status="success")
        except Exception as e:
            logger.warning(f"Gemini API call failed or timed out: {e}")

    # 3. Intelligent Built-in Hackathon Buddy Copilot Engine
    reply = _synthesize_hackathon_reply(message, request.skills, user_context)
    return ChatResponse(response=reply, provider="hackathon-engine", status="success")

def _synthesize_hackathon_reply(prompt: str, skills: Optional[List[str]], user_context: str) -> str:
    p = prompt.lower()
    skills_list = skills or ["React", "Spring Boot", "Python", "MySQL"]
    skills_text = ", ".join(skills_list)

    if any(k in p for k in ["idea", "project", "topic", "build", "what to make"]):
        return (
            f"### 💡 High-Impact Hackathon Project Concepts for Your Stack\n\n"
            f"Based on your active skills (**{skills_text}**), here are 3 winning project blueprints:\n\n"
            f"1. **AI-Powered Emergency Resource & Triage Mesh**\n"
            f"   - **Problem:** Disaster relief units struggle with real-time supply matching and victim triage.\n"
            f"   - **Tech Stack:** {skills_text} with WebSocket telemetry.\n"
            f"   - **Hackathon Edge:** Live map demo + instant simulated scenario creates huge judge appeal.\n\n"
            f"2. **Autonomous Hackathon Squad & Skill Gap Solver**\n"
            f"   - **Problem:** Developers form mismatched squads and hit architecture roadblocks mid-sprint.\n"
            f"   - **Tech Stack:** {skills_text} with vector compatibility matching.\n"
            f"   - **Hackathon Edge:** Solves the exact problem judges and organizers see every day!\n\n"
            f"3. **Zero-Knowledge FinTech Micro-Lending Portal**\n"
            f"   - **Problem:** Students and gig-economy workers lack collateral credit history for hardware loans.\n"
            f"   - **Tech Stack:** {skills_text} with smart contract / risk scoring integration.\n\n"
            f"👉 *Which of these domains excites your team most? Tell me and I'll generate a full sprint architecture!*"
        )

    if any(k in p for k in ["team", "member", "squad", "partner", "recruiting", "match"]):
        return (
            f"### 👥 Optimal Hackathon Team Formation Strategy\n\n"
            f"A championship hackathon squad follows the **Hacker, Hipster, Hustler** balance:\n\n"
            f"1. **Backend / Architecture Lead:** Builds reliable APIs, database schemas, and AI integration ({skills_text}).\n"
            f"2. **Frontend & UX Specialist:** Crafts polished UI with animations, micro-interactions, and clear demo flows.\n"
            f"3. **Domain & Pitch Specialist:** Handles product storytelling, problem validation, and slide deck delivery.\n\n"
            f"**Tips for your current profile:**\n"
            f"- Use our **AI Hub → Teammate Matching** to search for candidates with complementary skills.\n"
            f"- Run **Skill Gap Analysis** before starting development to spot missing expertise (e.g. Cloud/DevOps or ML).\n"
            f"- Keep the team between **3 to 4 members** for maximum agility during the 24–48 hour sprint."
        )

    if any(k in p for k in ["architecture", "stack", "database", "backend", "frontend", "api"]):
        return (
            f"### 🛠 Recommended Hackathon System Architecture\n\n"
            f"Here is a production-grade, rapid-delivery architecture tailored for **{skills_text}**:\n\n"
            f"- **Client Tier:** React (Vite) + Vanilla CSS/Tailwind for sub-second hot reload and sleek dark-mode aesthetics.\n"
            f"- **Application Core:** Spring Boot 3 / Java 17 for rock-solid authentication (JWT), REST endpoints, and WebSocket communication.\n"
            f"- **Database Tier:** TiDB Cloud / MySQL via Spring Data JPA with auto-updating schema and relational integrity.\n"
            f"- **AI / ML Layer:** Python FastAPI microservice handling vector similarity, candidate matching, and LLM synthesis.\n\n"
            f"**Pro Hackathon Tip:** Keep API contracts simple and decoupled early so frontend and backend teammates can work in parallel without blocking each other!"
        )

    if any(k in p for k in ["pitch", "present", "judge", "win", "demo", "slide"]):
        return (
            f"### 🏆 3-Minute Hackathon Winning Pitch Framework\n\n"
            f"Judges score on **Problem Validation (25%)**, **Technical Execution (30%)**, **Innovation (25%)**, and **Presentation (20%)**:\n\n"
            f"1. **Hook (0:00 - 0:30):** State the pain point with a real-world statistic. Don't describe code yet — describe the victim's struggle.\n"
            f"2. **The Solution (0:30 - 1:00):** Introduce your product in one punchy sentence. Explain what makes it 10x better.\n"
            f"3. **Live Demo (1:00 - 2:15):** Walk through the happy path. Click through working features live! Always have a recorded backup video just in case.\n"
            f"4. **Technical Architecture & Future Roadmap (2:15 - 2:45):** Mention your stack (**{skills_text}**), scalable architecture, and security.\n"
            f"5. **Call to Action (2:45 - 3:00):** Thank the judges and invite questions with confidence."
        )

    # General supportive answer
    return (
        f"### 🚀 Hackathon Buddy Copilot Assistance\n\n"
        f"You asked: *\"{prompt}\"*\n\n"
        f"Here are strategic recommendations for your hackathon sprint:\n\n"
        f"- **Sprint Focus:** Focus on delivering a working core end-to-end loop rather than 10 half-finished features. Judges love seeing an idea work seamlessly from frontend to database.\n"
        f"- **Leverage Your Strengths:** Your registered skills include **{skills_text}**. Center your product demo around these technologies.\n"
        f"- **Collaboration:** You can coordinate live in the **Chat → Squads** channels with your teammates or use the **AI Hub** to audit technical gaps.\n\n"
        f"How else can I help? Feel free to ask about project blueprints, API debugging, presentation slides, or system architecture!"
    )
