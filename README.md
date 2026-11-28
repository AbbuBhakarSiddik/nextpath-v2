
# 🚀 NextPath AI

### An AI-Powered Career Intelligence Platform

**Build your skills. Discover your path. Shape your future.**

NextPath AI is an open-source AI-powered career intelligence platform designed to help developers navigate their professional journey.

From personalized career roadmaps and AI-powered guidance to technical skill assessments and developer networking, NextPath AI brings essential career development tools into one platform.

Our mission is to make career growth smarter, more accessible, and community-driven.

---

## ✨ Features

### 🤖 AI Career Assistant
- AI-powered career guidance and technical mentorship.
- Interactive conversations powered by Google Gemini.
- Multiple AI personas for different perspectives:
  - Systems Architect
  - Technical Recruiter
  - Startup Founder
  - Developer Mentor

### 🎯 Career Intelligence
- Generate personalized career roadmaps.
- Analyze existing skills and identify skill gaps.
- Discover recommended courses and certifications.
- Explore practical project ideas for career development.

### 🧠 AI Skill Challenges
- AI-generated technical and logical questions.
- Multiple difficulty levels.
- Coding, logical reasoning, and error-related challenges.
- Performance tracking and leaderboard functionality.

### 🌍 Developer Community
- Create and showcase developer profiles.
- Share professional skills and projects.
- Discover and search community profiles.
- Connect with developers and explore opportunities.

### 📰 Technology News
- Discover technology-related news.
- Search for industry updates.
- Stay informed about developments in technology.

### 📊 AI Activity
- Store and retrieve recent AI-generated outputs.
- Explore previous career and learning interactions.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React.js |
| UI Framework | Bootstrap, React Bootstrap |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| AI Integration | Google Gemini API |
| Google Integration | Google OAuth libraries |
| News Integration | NewsAPI |
| HTTP Client | Axios |
| Language | JavaScript |

---

## 📂 Project Structure

```text
nextpath-v2/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   └── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
│
├── run.js
├── package.json
├── .gitignore
└── LICENSE
```

---

## 🚀 Getting Started

Want to run NextPath AI locally? Follow these steps.

### Prerequisites

Make sure you have:

- Node.js and npm
- PostgreSQL database
- Google Gemini API key
- NewsAPI key

### 1. Clone the repository

```bash
git clone https://github.com/AbbuBhakarSiddik/nextpath-v2.git

cd nextpath-v2
```

### 2. Install dependencies

Install backend dependencies:

```bash
npm install --prefix backend
```

Install frontend dependencies:

```bash
npm install --prefix frontend
```

### 3. Configure environment variables

Create your backend environment file.

```bash
cp backend/.env.example backend/.env
```

For Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Configure `backend/.env`:

```env
PORT=5000
NODE_ENV=development

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-flash-lite-latest

NEWS_API_KEY=your_newsapi_key

DATABASE_URL="your_postgresql_connection_string"
```

Get your API keys:

- [Google AI Studio](https://aistudio.google.com/)
- [NewsAPI](https://newsapi.org/)

Never commit your actual API keys or `.env` files.

### 4. Configure the database

Configure PostgreSQL and provide a valid `DATABASE_URL`.

Generate the Prisma client:

```bash
npm run db:generate
```

Apply the Prisma schema to your database:

```bash
npm run db:push
```

### 5. Start the application

From the project root:

```bash
npm run dev
```

This starts the backend and frontend development servers concurrently.

### Local development URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| API Health Check | http://localhost:5000/api/health |

---

## 💻 Development Commands

Start backend only:

```bash
npm run dev:backend
```

Start frontend only:

```bash
npm run dev:frontend
```

Build frontend:

```bash
npm run build
```

Generate Prisma client:

```bash
npm run db:generate
```

---

## 🤝 Contributing

NextPath AI is open to contributions from developers around the world!

We believe great software is built through collaboration, experimentation, and shared knowledge.

Whether you're a beginner making your first open-source contribution or an experienced developer interested in improving the architecture, you're welcome here.

### What can you contribute?

- 🚀 New AI-powered career features.
- 🧠 Improvements to AI prompts and recommendations.
- 🎨 Frontend and UI/UX improvements.
- ⚙️ Backend APIs and architecture improvements.
- 🗄️ Database optimization and schema improvements.
- 🐛 Bug fixes and performance improvements.
- 📚 Documentation and developer experience.

### Contribution workflow

1. Fork the repository.
2. Clone your fork.
3. Create a new feature branch.
4. Implement and test your changes.
5. Push your branch.
6. Open a Pull Request.

Example:

```bash
git checkout -b feature/your-feature-name
```

Please open an issue to discuss substantial changes before implementing them.

Detailed contribution guidelines will be published in `CONTRIBUTING.md`.

---

## 🗺️ Project Roadmap

Our roadmap will evolve with community feedback and contributions.

- [ ] Improve AI career recommendation quality.
- [ ] Expand career roadmap capabilities.
- [ ] Improve developer community features.
- [ ] Expand automated testing.
- [ ] Improve API documentation.
- [ ] Strengthen application security.
- [ ] Improve performance and scalability.
- [ ] Build a welcoming contributor community.

Have an idea? Open a GitHub Issue and share it with us!

---

## 📜 License

NextPath AI is licensed under the MIT License.

You are free to use, modify, distribute, and build upon this project under the terms of the license.

See [LICENSE](LICENSE) for details.

---

## ❤️ Join the Community

Help us make career growth accessible to every developer.

- ⭐ Star the repository.
- 🐛 Report bugs.
- 💡 Share feature ideas.
- 🔧 Submit Pull Requests.
- 🌍 Help improve the project.

**Built with ❤️ for developers, by developers.**

Let's build the future of career intelligence together!
