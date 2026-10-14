import unittest
from app.schemas.chat import ChatRequest, ChatHistoryItem
from app.services.chat_bot import generate_chatbot_response

class TestChatService(unittest.TestCase):
    def test_domain_response_generation(self):
        req = ChatRequest(
            message="What is the best tech stack for an AI hackathon project?",
            userContext="John (Backend Engineer)",
            skills=["Java", "Spring Boot", "Python"],
            history=[]
        )
        res = generate_chatbot_response(req)
        self.assertIsNotNone(res)
        self.assertEqual(res.status, "success")
        self.assertTrue(len(res.response) > 50)
        self.assertTrue("Architecture" in res.response or "Stack" in res.response or "FastAPI" in res.response or "Backend" in res.response or "Hackathon" in res.response)

    def test_pitch_response_generation(self):
        req = ChatRequest(
            message="How do we prepare our 3-minute pitch presentation?",
            userContext="Sarah",
            skills=[],
            history=[]
        )
        res = generate_chatbot_response(req)
        self.assertIsNotNone(res)
        self.assertEqual(res.status, "success")
        self.assertTrue("Pitch" in res.response or "Demo" in res.response or "Problem" in res.response or "Judging" in res.response)

    def test_empty_message_greeting(self):
        req = ChatRequest(
            message="",
            userContext="Alex",
            skills=["React"],
            history=[]
        )
        res = generate_chatbot_response(req)
        self.assertIsNotNone(res)
        self.assertEqual(res.status, "success")
        self.assertTrue("Hackathon Buddy AI Copilot" in res.response)

if __name__ == '__main__':
    unittest.main()
