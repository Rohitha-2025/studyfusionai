import express from 'express';
import { generateContent, isGeminiConfigured } from '../services/gemini.js';

const router = express.Router();

router.post('/youtube-quiz', async (req, res, next) => {
  try {
    const { transcript, videoUrl } = req.body;

    if (!transcript) {
      return res.status(400).json({ 
        error: 'Transcript is required. Please paste the video transcript manually.' 
      });
    }

    if (!isGeminiConfigured()) {
      return res.json({
        demoMode: true,
        message: 'Demo mode: Configure Gemini API key for AI-powered summarization and quiz generation',
        summary: 'Configure your Gemini API key to automatically generate summaries from video transcripts.',
        keyPoints: ['API key required for this feature'],
        quiz: []
      });
    }

    // Truncate very long transcripts
    const maxLength = 15000;
    const processedTranscript = transcript.length > maxLength 
      ? transcript.substring(0, maxLength) + '...[truncated]'
      : transcript;

    const prompt = `Analyze the following video transcript and create a summary and quiz.

Transcript:
${processedTranscript}

Generate a response in this JSON format:
{
  "summary": "A concise 3-4 sentence summary of the main content",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "quiz": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Create 5-8 multiple choice questions that test understanding of the key concepts. Make questions educational and relevant.`;

    const response = await generateContent(prompt);
    
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      result = {
        summary: response,
        keyPoints: ['See summary above'],
        quiz: []
      };
    }

    res.json({ ...result, demoMode: false, videoUrl });
  } catch (error) {
    next(error);
  }
});

export default router;
