Resume AI Rater - Starter
=========================

What's included
- frontend/: Vite + React (TypeScript) minimal app with file upload & paste-to-analyze UI.
- backend/: Spring Boot app with a simple heuristic-based analyzer and /api endpoints.
- This is a starter kit — AI model integration (OpenAI / local model) is left as an exercise and hooks are documented.

Quick start (frontend)
1. cd frontend
2. npm install
3. npm run dev
- The Vite dev server proxies /api to http://localhost:8080

Quick start (backend)
1. cd backend
2. mvn spring-boot:run
- Java 17 required.

Notes & next steps
- Add Apache POI for robust docx parsing.
- Replace heuristics with an AI scoring model (call OpenAI/other LLM) from AnalyzeController.analyzeText.
- Add OAuth login (Google/FB/LinkedIn). For production, use proper OAuth libraries and secure storage.
- Add rate-limiting, caching and a DB if you want to support 100k daily users (load balancing + stateless services).
- For AAA accessibility, ensure semantic HTML, color contrast, keyboard focus states and ARIA attributes in frontend components.

File created at: /mnt/data/resume-ai-starter.zip
