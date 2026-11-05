import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { generateContent, isGeminiConfigured } from '../services/gemini.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

router.post('/pdf-highlight', upload.single('pdf'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Could not extract text from PDF. The file might be empty or image-based.' 
      });
    }

    // Truncate very long documents
    const maxLength = 10000;
    const processedText = extractedText.length > maxLength
      ? extractedText.substring(0, maxLength) + '...[truncated for analysis]'
      : extractedText;

    if (!isGeminiConfigured()) {
      return res.json({
        demoMode: true,
        message: 'PDF text extracted successfully. Configure Gemini API key for AI-powered highlighting.',
        extractedText: processedText,
        highlights: [],
        keyTakeaways: ['Configure Gemini API key to identify key concepts automatically'],
        totalPages: pdfData.numpages,
        fileName: req.file.originalname
      });
    }

    const prompt = `Analyze this educational document and identify the most important content:

${processedText}

Return a JSON response with:
{
  "highlights": [
    {
      "text": "Important sentence or phrase from the document",
      "reason": "Why this is important",
      "category": "definition|concept|key_point|example"
    }
  ],
  "keyTakeaways": ["Main takeaway 1", "Main takeaway 2", "Main takeaway 3"],
  "summary": "Brief 2-3 sentence summary of the document"
}

Identify 5-10 highlights that would be most valuable for exam preparation.`;

    const response = await generateContent(prompt);
    
    let analysis;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      analysis = {
        highlights: [],
        keyTakeaways: [response],
        summary: response
      };
    }

    res.json({
      ...analysis,
      extractedText: processedText,
      totalPages: pdfData.numpages,
      fileName: req.file.originalname,
      demoMode: false
    });
  } catch (error) {
    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

export default router;
