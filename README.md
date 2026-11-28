
# NextPath AI 🚀

### Your AI-Powered Career Intelligence Platform

NextPath AI is an open-source AI-powered career intelligence platform designed to help developers explore career opportunities, improve their technical skills, discover learning paths, and connect with the developer community.

Built with React, Node.js, Express, PostgreSQL, Prisma, and Google Gemini AI.

**Our mission is simple: Make career growth smarter, more accessible, and community-driven.**

---

## ✨ Features

### 🤖 AI Career Assistant
- AI-powered career guidance and assistance.
- Interactive AI chat experience.
- Career-related recommendations powered by Google Gemini.

### 🎯 Career Roadmaps
- Explore strategic career roadmaps.
- Identify existing and missing skills.
- Discover relevant learning resources and projects.

### 🧠 IQ & Skill Challenges
- Interactive quizzes and skill assessments.
- Multiple categories and difficulty levels.
- Scores, performance tracking, and leaderboard support.

### 🌍 Developer Community
- Developer profiles and professional information.
- Showcase skills and projects.
- Connect with other developers.

### 📰 Tech News
- Discover technology-related news.
- Stay updated with developments in the tech industry.

### 📊 Activity Tracking
- Access recent AI interactions and activity.
- Keep track of generated career-related outputs.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| UI | Bootstrap, React Bootstrap |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| AI Integration | Google Gemini API |
| Authentication Integration | Google OAuth |
| News Integration | NewsAPI |
| HTTP Client | Axios |

---

## 📁 Project Structure

```text
nextpath-v2/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   └── ...
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── run.js
├── package.json
├── .gitignore
└── LICENSE
```

---

## 🚀 Getting Started

Follow these steps to run NextPath AI locally.

### Prerequisites

Make sure you have:

- Node.js (LTS recommended)
- npm
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

Create your backend environment file:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Configure the following values in `backend/.env`:

```env
PORT=5000
NODE_ENV=development

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-flash-lite-latest

NEWS_API_KEY=your_news_api_key

DATABASE_URL="your_postgresql_connection_string"
```

Obtain your API credentials:

- Gemini: https://aistudio.google.com/
- NewsAPI: https://newsapi.org/

Never commit your actual API keys or environment files.

### 4. Configure the database

Make sure PostgreSQL is running and your `DATABASE_URL` is correct.

Generate the Prisma client:

```bash
npm run db:generate
```

Push the database schema:

```bash
npm run db:push
```

### 5. Start the application

From the project root:

```bash
npm run dev
```

The development runner starts both services.

| Service | Local URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| Health Check | http://localhost:5000/api/health |

---

## 🧪 Development

Start only the backend:

```bash
npm run dev:backend
```

Start only the frontend:

```bash
npm run dev:frontend
```

Build the frontend:

```bash
npm run build
```

---

## 🤝 Contributing

We welcome developers, designers, students, and AI enthusiasts to contribute to NextPath AI!

Whether you're fixing bugs, improving the UI, developing new features, optimizing APIs, or suggesting ideas, your contributions are valuable.

### How to contribute

1. Fork this repository.
2. Clone your fork.
3. Create a feature branch.
4. Make your changes.
5. Test your changes.
6. Submit a Pull Request.

Example:

```bash
git checkout -b feature/your-feature-name
```

We are working on detailed contribution guidelines. Please check `CONTRIBUTING.md` before submitting your contribution.

---

## 💡 Ways to Contribute

- Improve AI career recommendations.
- Build new AI-powered features.
- Improve frontend UI/UX.
- Optimize backend performance.
- Improve database architecture.
- Add new career roadmaps.
- Fix bugs and improve documentation.
- Improve testing and security.

Look for issues labelled `good first issue` and `help wanted`.

---

## 🗺️ Roadmap

Our development roadmap is community-driven.

Planned areas of improvement include:

- [ ] Improve AI career recommendation quality.
- [ ] Expand career roadmap library.
- [ ] Improve developer community features.
- [ ] Expand testing and automated CI.
- [ ] Improve API documentation.
- [ ] Enhance application performance.
- [ ] Welcome and support external contributors.

Suggestions and feature requests are welcome through GitHub Issues.

---

## 📜 License

NextPath AI is distributed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

## ❤️ Community

Interested in contributing?

- ⭐ Star this repository.
- 🐛 Report bugs through GitHub Issues.
- 💡 Suggest new features.
- 🔧 Submit Pull Requests.
- 🌍 Help us improve the platform.

**Built with ❤️ for developers, by developers.**

Let's make career growth open-source.
