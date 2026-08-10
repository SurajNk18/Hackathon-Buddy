# Hackathon Buddy

AI-Powered Hackathon Team Formation & Collaboration Platform.

## System Architecture

The system consists of three main components:
1. **Frontend**: React.js + Vite
2. **Backend**: Spring Boot + MySQL
3. **AI Service**: Python FastAPI + Scikit-learn

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Java 17
- Maven
- Python 3.10+
- MySQL 8.0+
- Docker & Docker Compose (optional, for easy setup)

### Environment Variables
Copy the `.env.example` file to `.env` in the root directory:
```bash
cp .env.example .env
```
Update the `.env` file with your actual database credentials, JWT secrets, and API keys.

### Running with Docker Compose (Recommended)
You can start all services (MySQL, Backend, Frontend, AI Service) using Docker Compose:
```bash
docker-compose up -d --build
```

### Running Locally (Without Docker)

#### 1. Database
Ensure MySQL is running and create a database named `hackathon_buddy`. Update credentials in `backend/src/main/resources/application.yml` or use the `.env` file.

#### 2. Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
# The API will be available at http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

#### 3. AI Service (Python FastAPI)
```bash
cd ai-service
python -m venv venv
# Activate venv: `venv\Scripts\activate` on Windows or `source venv/bin/activate` on Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# The AI API will be available at http://localhost:8000
# Docs: http://localhost:8000/docs
```

#### 4. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# The Frontend will be available at http://localhost:5173
```

## Documentation
- [Architecture](docs/architecture.md)
- [Database Schema](database/schema.sql)
