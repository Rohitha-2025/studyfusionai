import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import codeRoutes from './routes/code.js';
import sleepRoutes from './routes/sleep.js';
import youtubeRoutes from './routes/youtube.js';
import pdfRoutes from './routes/pdf.js';
import skillRoutes from './routes/skill.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  res.json({ 
    status: 'ok',
    message: 'StudyFusionAI API is running',
    geminiConfigured: hasApiKey,
    timestamp: new Date().toISOString()
  });
});

// Diagnostic endpoint (safe - doesn't expose the key)
app.get('/api/config-check', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  res.json({
    envLoaded: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    keyPrefix: apiKey ? apiKey.substring(0, 6) + '...' : 'none',
    isPlaceholder: apiKey === 'your_gemini_api_key_here',
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api', codeRoutes);
app.use('/api', sleepRoutes);
app.use('/api', youtubeRoutes);
app.use('/api', pdfRoutes);
app.use('/api', skillRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 StudyFusionAI Server running on http://localhost:${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  
  const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  if (!hasApiKey) {
    console.warn('⚠️  Warning: GEMINI_API_KEY not configured. AI features will use demo mode.');
    console.warn('   Add your API key to .env file for full functionality.');
  } else {
    console.log('✅ Gemini API key configured');
  }
});
