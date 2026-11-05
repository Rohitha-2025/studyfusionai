import express from 'express';
import { generateContent, isGeminiConfigured } from '../services/gemini.js';

const router = express.Router();

router.post('/analyze-code', async (req, res, next) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const validLanguages = ['java', 'python', 'cpp', 'javascript'];
    if (!validLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid language. Supported: Java, Python, C++, JavaScript' });
    }

    if (!isGeminiConfigured()) {
      // Demo mode response
      return res.json({
        demoMode: true,
        message: 'Demo mode: Configure Gemini API key for real AI analysis',
        analysis: {
          explanation: `This is a ${language} code snippet. To get detailed AI-powered analysis including error detection, optimization suggestions, and complexity analysis, please configure your Gemini API key in the .env file.`,
          errors: ['Demo mode: Real error detection requires API key'],
          suggestions: ['Configure Gemini API key for intelligent suggestions'],
          correctedCode: code,
          complexity: {
            time: 'Configure API key for complexity analysis',
            space: 'Configure API key for complexity analysis'
          }
        }
      });
    }

    const prompt = `You are an expert code reviewer and software engineer. Perform a comprehensive analysis of this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide a detailed analysis in this exact JSON format:
{
  "explanation": "Clear explanation of what this code does and its purpose",
  "errors": ["Specific bugs, syntax errors, logical errors, or runtime issues"],
  "warnings": ["Potential issues, code smells, or anti-patterns"],
  "suggestions": ["Actionable improvements for readability, performance, or best practices"],
  "security": ["Security vulnerabilities or concerns if any"],
  "bestPractices": ["Violations of ${language} best practices and how to fix them"],
  "correctedCode": "Improved version with fixes applied",
  "complexity": {
    "time": "Time complexity with explanation (e.g., O(n) - single loop)",
    "space": "Space complexity with explanation (e.g., O(1) - constant space)"
  },
  "performance": {
    "rating": "Excellent|Good|Fair|Poor",
    "bottlenecks": ["Identified performance bottlenecks"],
    "optimizations": ["Specific optimization suggestions"]
  },
  "codeQuality": {
    "score": 85,
    "readability": "High|Medium|Low",
    "maintainability": "High|Medium|Low",
    "testability": "High|Medium|Low"
  }
}

Be thorough, specific, and educational. If no issues in a category, use empty arrays.`;

    const response = await generateContent(prompt);
    
    // Try to parse JSON from response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If JSON parsing fails, structure the response manually
      analysis = {
        explanation: response,
        errors: [],
        suggestions: ['See explanation above'],
        correctedCode: code,
        complexity: {
          time: 'See explanation',
          space: 'See explanation'
        }
      };
    }

    res.json({ analysis, demoMode: false });
  } catch (error) {
    next(error);
  }
});

export default router;
