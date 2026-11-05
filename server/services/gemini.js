import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
let model = null;

const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('❌ Gemini initialization failed: API key not configured');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('✅ Gemini AI initialized successfully with model: gemini-2.5-flash');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Gemini:', error.message);
    return false;
  }
};

export const isGeminiConfigured = () => {
  if (!model) {
    return initializeGemini();
  }
  return true;
};

export const generateContent = async (prompt) => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API is not configured. Please add your API key to .env file.');
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Gemini API call successful');
    return text;
  } catch (error) {
    console.error('❌ Gemini API error:', error.message);
    
    // Provide specific error messages based on error type
    if (error.message.includes('404')) {
      throw new Error('Model not available. Please check your API configuration.');
    } else if (error.message.includes('429')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message.includes('403')) {
      throw new Error('API key permission denied. Please check your API key.');
    } else if (error.message.includes('API key')) {
      throw new Error('Invalid API key. Please verify your Gemini API key.');
    } else {
      throw new Error('Failed to generate AI response: ' + error.message);
    }
  }
};
