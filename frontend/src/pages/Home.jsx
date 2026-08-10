import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';

const Home = () => {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [aiStatus, setAiStatus] = useState('Checking...');

  useEffect(() => {
    // Check Spring Boot Backend
    api.get('/health')
      .then(res => setBackendStatus(res.data.status === 'up' ? 'Online' : 'Offline'))
      .catch(() => setBackendStatus('Offline (Backend Not Running)'));

    // Check AI Service directly for demo purposes (usually backend calls this)
    axios.get('http://localhost:8000/health')
      .then(res => setAiStatus(res.data.status === 'up' ? 'Online' : 'Offline'))
      .catch(() => setAiStatus('Offline (AI Service Not Running)'));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Hackathon Buddy 🚀</h1>
      <p>AI-Powered Hackathon Team Formation & Collaboration Platform</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>System Status:</h3>
        <ul>
          <li><strong>Frontend:</strong> Online ✅</li>
          <li><strong>Backend (Spring Boot):</strong> {backendStatus}</li>
          <li><strong>AI Service (FastAPI):</strong> {aiStatus}</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h4>Next Steps for Development:</h4>
        <ol>
          <li>Start the MySQL Database (e.g., via Docker Compose).</li>
          <li>Start the Spring Boot Backend (<code>mvn spring-boot:run</code>).</li>
          <li>Start the Python AI Service (<code>uvicorn app.main:app --reload</code>).</li>
        </ol>
      </div>
    </div>
  );
};

export default Home;
