import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const apiKey = process.env.GEMINI_API_KEY;

console.log('API Key loaded:', apiKey ? `Yes (length: ${apiKey.length}, prefix: ${apiKey.substring(0, 10)}...)` : 'No');

if (!apiKey) {
  console.error('No API key found!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Try to list available models
async function testModels() {
  try {
    console.log('\n🔍 Testing different model names...\n');
    
    const modelNames = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro-latest',
      'models/gemini-pro',
      'models/gemini-1.5-pro'
    ];
    
    for (const modelName of modelNames) {
      try {
        console.log(`Testing: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "Hello"');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ SUCCESS with ${modelName}: ${text.substring(0, 50)}...\n`);
        break; // Stop on first success
      } catch (error) {
        console.log(`❌ Failed with ${modelName}: ${error.message.substring(0, 100)}...`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testModels();
