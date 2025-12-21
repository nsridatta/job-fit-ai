<div align="center">

# 🚀 JobFit AI

### Free AI-Powered Resume Analyzer

**Optimize your job application with instant, data-driven insights.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F?logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Live Demo](https://job-fit-ai-coral.vercel.app) • [Report Bug](https://github.com/nsridatta/job-fit-ai/issues) • [Request Feature](https://github.com/nsridatta/job-fit-ai/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **Resume Upload** | Drag-and-drop or click to upload PDF, DOC, DOCX files (max 5MB) |
| 🤖 **AI Analysis** | Powered by OpenRouter/OpenAI for intelligent resume scoring |
| 📊 **Section Scores** | Get detailed scores for Experience, Skills, Education, and more |
| 🔑 **Keyword Matching** | Identifies missing keywords from the job description |
| 🛡️ **ATS Compatibility** | Template verdict for Applicant Tracking System optimization |
| 🔒 **Privacy First** | Your data is processed but never stored |

---

## 🖼️ Screenshots

<div align="center">
<img src="https://via.placeholder.com/800x450?text=Dashboard+Screenshot" alt="Dashboard" width="80%"/>
<p><em>Modern, professional dashboard with real-time analysis</em></p>
</div>

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **Icons:** Phosphor Icons (react-icons/pi)
- **Build Tool:** Vite 7
- **UI Components:** Custom design system with Chakra UI

### Backend
- **Framework:** Spring Boot 3.4
- **Language:** Java 17+
- **AI Integration:** OpenRouter API (OpenAI-compatible)
- **File Parsing:** Apache PDFBox for PDF extraction

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Java** 17+ and Maven
- **OpenRouter API Key** (or OpenAI API Key)

### 1. Clone the Repository
```bash
git clone https://github.com/nsridatta/job-fit-ai.git
cd job-fit-ai
```

### 2. Backend Setup
```bash
cd backend

# Set your API key (create .env file or set environment variable)
export OPENROUTER_API_KEY=your_api_key_here

# Run the Spring Boot server
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will start on `http://localhost:5173` and proxy API requests to the backend.

---

## 📁 Project Structure

```
resume-ai-starter/
├── backend/                    # Spring Boot application
│   ├── src/main/java/
│   │   └── com/jobfit/ai/
│   │       ├── controller/     # REST API endpoints
│   │       ├── service/        # Business logic & AI integration
│   │       └── model/          # Data models
│   └── src/main/resources/
│       └── application.yml     # Configuration
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── ui/             # Design system (Button, Card, Input, etc.)
│   │   ├── pages/              # Page components (Dashboard, Results)
│   │   └── api.ts              # API client
│   ├── index.html
│   └── vite.config.ts
│
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter/OpenAI API key | ✅ Yes |

### Backend Configuration (`application.yml`)
```yaml
spring:
  ai:
    openai:
      api-key: ${OPENROUTER_API_KEY}
      base-url: https://openrouter.ai/api/v1
      chat:
        options:
          model: deepseek/deepseek-chat-v3-0324
          temperature: 0.5

server:
  port: 8080
```

### Frontend Proxy (`vite.config.ts`)
The development server proxies `/api` requests to the backend:
```typescript
proxy: {
  "/api": {
    target: "http://localhost:8080",
    changeOrigin: true
  }
}
```

---

## 🛣️ Roadmap

- [x] Basic resume upload and analysis
- [x] AI-powered scoring with OpenRouter
- [x] Modern, responsive UI design
- [ ] Apache POI for robust DOCX parsing
- [ ] OAuth login (Google, LinkedIn)
- [ ] User accounts and history
- [ ] Rate limiting and caching
- [ ] Database integration for scaling

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [OpenRouter](https://openrouter.ai/) for AI API access
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Phosphor Icons](https://phosphoricons.com/) for beautiful icons
- [Enhancv](https://enhancv.com/) for design inspiration

---

<div align="center">

**Built with ❤️ by [Sri Datta](https://github.com/nsridatta)**

⭐ Star this repo if you found it helpful!

</div>
