# Quick Start Guide - StudyFusionAI

## ✅ Current Status

Your StudyFusionAI application is **READY TO USE**!

- ✅ All code files created
- ✅ Dependencies installed
- ✅ Backend server tested and working
- ✅ Frontend tested and working
- ✅ Both servers currently running!

## 🚀 Access the Application RIGHT NOW

If the servers are still running, simply open your browser:

**http://localhost:5173**

You should see the StudyFusionAI landing page!

## 🔄 Restart Instructions (if needed)

If you closed the terminals or need to restart:

### Option 1: Start Everything Together (Recommended)

```bash
npm run dev
```

This single command starts both frontend and backend!

### Option 2: Start Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

## 🌐 URLs

- **Frontend (Your Main App):** http://localhost:5173
- **Backend API:** http://localhost:3001
- **API Health Check:** http://localhost:3001/api/health

## 🔑 Gemini API Key (Optional but Recommended)

The app works in demo mode WITHOUT an API key, but for full AI features:

1. Get a free API key: https://aistudio.google.com/apikey
2. Open the `.env` file in the root folder
3. Replace `your_gemini_api_key_here` with your actual key
4. Restart the servers

## 🎯 Features Available

### ✅ Working WITHOUT API Key (Demo Mode):
- Smart Sleep Planner (uses local scheduling algorithm)
- AI Skill Forecast (uses local roadmap generator)
- PDF Highlighter (extracts text, needs API for AI highlighting)
- YouTube Summarizer (needs API for summaries)
- AI Coding Analyzer (needs API for analysis)

### ✨ Working WITH API Key:
- All features above with full AI-powered insights
- Intelligent error detection in code
- Personalized study schedules
- AI-generated quizzes from transcripts
- Automatic PDF concept highlighting
- Smart learning roadmaps

## 🧪 Quick Test

1. Open http://localhost:5173
2. Click "Launch Dashboard"
3. Try "Smart Sleep Planner":
   - Pick an exam date
   - Set study hours
   - Click "Generate Schedule"
   - See your personalized study plan!

## 🐛 Troubleshooting

### Port Already in Use

If port 3001 or 5173 is already taken:

1. Stop the existing process using that port, OR
2. Change the port in `.env` (for backend) or `client/vite.config.js` (for frontend)

### Module Not Found

Run the install command again:
```bash
npm run install:all
```

### API Not Responding

Check if the backend is running:
```bash
curl http://localhost:3001/api/health
```

Should return: `{"status":"ok", ...}`

## 📱 Demo Workflow

Try this complete workflow:

1. **Landing Page** → Click "Get Started"
2. **Dashboard** → View all 5 tools
3. **Code Analyzer** → Paste some Python code, analyze it
4. **Sleep Planner** → Create a study schedule
5. **Skill Forecast** → Plan learning "React" or any skill
6. **PDF Highlighter** → Upload a PDF (need a PDF file)
7. **YouTube Quiz** → Paste a transcript and generate a quiz

## 💡 Tips

- Dark theme optimized for comfort
- All forms validate inputs
- Loading spinners show processing status
- Error messages are clear and helpful
- Demo mode clearly labeled when API key is missing
- Mobile responsive design

## 🎓 Project Structure

```
project3/
├── client/          # React frontend (Vite + Tailwind)
├── server/          # Express backend (Node.js)
├── .env             # Environment variables (API key)
├── .env.example     # Template
├── package.json     # Root scripts
└── README.md        # Full documentation
```

## ✨ You're All Set!

Open **http://localhost:5173** and start using StudyFusionAI!

For detailed documentation, see **README.md**.
