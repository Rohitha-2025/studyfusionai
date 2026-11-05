# StudyFusionAI

**Your AI-powered companion for smarter learning.**

A comprehensive educational performance optimization platform powered by Google Gemini AI, featuring five intelligent tools to enhance student productivity and learning outcomes.

## Features

### 🔍 AI Coding Analyzer
- Supports Java, Python, C++, and JavaScript
- Identifies errors and suggests corrections
- Explains code functionality
- Analyzes time and space complexity

### 😴 Smart Sleep Planner
- Generates personalized study schedules
- Balances study time with rest periods
- Considers exam dates and stress levels
- Optimizes learning retention

### 📺 YouTube Summarizer & Quiz Generator
- Summarizes educational videos
- Generates practice quizzes automatically
- Interactive quiz with scoring
- Extracts key learning points

### 📄 Smart PDF Highlighter
- Extracts text from PDF documents
- Highlights important concepts
- Identifies exam-relevant content
- Provides key takeaways

### 🎯 AI Skill Forecast
- Creates personalized learning roadmaps
- Estimates completion timelines
- Provides weekly milestones
- Recommends practice tasks

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide React
- **Backend:** Node.js, Express.js
- **AI:** Google Gemini API
- **PDF Processing:** pdf-parse
- **File Uploads:** multer

## Installation

### Prerequisites
- Node.js 18+ and npm

### Quick Start

1. **Navigate to the project directory**

2. **Install all dependencies (takes 3-5 minutes):**
```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

Or use the shortcut:
```bash
npm run install:all
```

3. **Configure environment variables (OPTIONAL):**

The `.env` file is already created. To enable full AI features:

```bash
# Edit .env and replace the placeholder with your actual Gemini API key:
# GEMINI_API_KEY=your_actual_api_key_here
```

**To get a Gemini API key:**
- Visit https://aistudio.google.com/apikey
- Sign in with your Google account
- Create a new API key
- Replace the placeholder in `.env` file

**Note:** The app works WITHOUT an API key in demo mode with local algorithms for most features.

4. **Start the application (Option 1 - Recommended):**

Start both frontend and backend together:
```bash
npm run dev
```

**OR (Option 2) - Start separately:**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

5. **Open your browser:**

Navigate to: **http://localhost:5173**

Backend API runs at: **http://localhost:3001**

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Explore the dashboard and select any tool
3. Follow the on-screen instructions for each feature

**Note:** Some features work without an API key (demo mode), but for full AI functionality, configure a valid Gemini API key in the `.env` file.

## Project Structure

```
studyfusionai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   └── index.js           # Server entry point
├── .env                    # Environment variables (create from .env.example)
├── .env.example           # Example environment file
└── README.md              # This file
```

## API Endpoints

- `GET /api/health` - Server health check
- `POST /api/analyze-code` - Analyze source code
- `POST /api/sleep-plan` - Generate study schedule
- `POST /api/youtube-quiz` - Create quiz from transcript
- `POST /api/pdf-highlight` - Extract and highlight PDF content
- `POST /api/skill-forecast` - Generate learning roadmap

## Troubleshooting

### Port already in use
If port 3001 or 5173 is already in use, modify the `PORT` variable in `.env` or the vite config.

### API key errors
Ensure your `.env` file exists in the root directory and contains a valid Gemini API key.

### Module not found errors
Run `npm run install:all` again to ensure all dependencies are installed.

## License

MIT License - Feel free to use this project for educational purposes.

## Disclaimer

This application provides educational assistance and productivity tools. AI-generated content should be reviewed and verified. Sleep recommendations and skill forecasts are estimates and not medical or professional advice.
