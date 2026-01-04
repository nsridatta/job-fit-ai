<div align="center">

# 🚀 JobFit AI

### Free AI-Powered Resume Analyzer

**Optimize your job application with instant, data-driven insights.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F?logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Live Demo](https://aijobfit.vercel.app) • [Report Bug](https://github.com/nsridatta/job-fit-ai/issues) • [Request Feature](https://github.com/nsridatta/job-fit-ai/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **Resume Upload** | Drag-and-drop or click to upload PDF files (max 5MB) |
| 🤖 **AI Analysis** | Powered by OpenRouter/OpenAI for intelligent resume scoring |
| ✍️ **Rich Text Editor** | Professional editor with Bold, Italic, Lists, and Headers for manual optimization |
| 🖼️ **Live PDF Preview** | Real-time PDF generation and preview as you edit your resume |
| 👤 **Profile Picture** | Upload and manage professional profile pictures for your resume |
| 💼 **Unified Experience** | Merged Work Experience and Projects for a professional, ATS-friendly layout |
| 📊 **Section Scores** | Get detailed scores for Experience, Skills, Education, and more |
| 🛡️ **ATS Compatibility** | Template verdict for Applicant Tracking System optimization |

---

## 🖼️ Screenshots

<div align="center">
<img src="./frontend/public/project.PNG" alt="Optimizer Hub" width="90%"/>
<p><em>Optimizer Hub: Rich Text Editor with Live PDF Preview</em></p>
</div>

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **State & Logic:** Functional components with React Hooks
- **Editor:** `react-quill-new` for rich text editing
- **PDF Engine:** `@react-pdf/renderer` for dynamic PDF generation
- **Styling:** Vanilla CSS & Tailwind CSS 3.4
- **Icons:** Phosphor Icons (react-icons/pi)
- **Build Tool:** Vite 7

### Backend
- **Framework:** Spring Boot 3.4
- **Language:** Java 17+
- **AI Integration:** Spring AI with OpenRouter API
- **Documentation:** Swagger/OpenAPI UI (`/swagger-ui/index.html`)
- **File Parsing:** Apache PDFBox

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Java** 17+ and Maven
- **OpenRouter API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/nsridatta/job-fit-ai.git
cd job-fit-ai
```

### 2. Backend Setup
```bash
cd backend
# Set your API key in environment variables
export OPENROUTER_API_KEY=your_api_key_here
mvn spring-boot:run
```
Available at `http://localhost:8080`. Explore the API at `/swagger-ui/index.html`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Available at `http://localhost:5173`.

---

## 📁 Project Structure

```
resume-ai-starter/
├── backend/                    
│   ├── src/main/java/com/example/resumeai/
│   │   ├── controller/     # REST API (Analyze, Swagger)
│   │   ├── service/        # AI Service logic
│   │   └── model/          # DTOs and Data models
│   └── src/main/resources/application.yml
│
├── frontend/                   
│   ├── src/
│   │   ├── components/     
│   │   │   ├── ResumePDF.tsx   # Custom HTML-to-PDF engine
│   │   │   └── ui/             # Design system components
│   │   ├── pages/              
│   │   │   ├── OptimizationHub.tsx # The main editor & preview hub
│   │   │   └── Dashboard.tsx       # File upload & analysis entry
│   │   └── index.css           # Global styles & Quill overrides
│   └── vite.config.ts
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
          model: nvidia/nemotron-3-nano-30b-a3b:free
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
- [x] Rich Text Editor integration
- [x] Live PDF Preview engine
- [x] Profile picture support
- [x] ATS Template compatibility checks
- [ ] OAuth login (Google, LinkedIn)
- [ ] User accounts and history tracking
- [ ] Multi-template PDF support

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
- [React Render PDF](https://react-pdf.org/) for PDF parsing and live review

---

<div align="center">

**Built with ❤️ by [Sri Datta](https://github.com/nsridatta)**

⭐ Star this repo if you found it helpful!

</div>
