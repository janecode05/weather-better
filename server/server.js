
require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is missing from backend .env');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Existing air-quality endpoint
function getAirQualityData() {
  return {
    city: 'Chennai',
    aqi: 100,
    status: 'Moderate',
    temperature: 29,
    humidity: 68,
    pm25: 65
  };
}

app.get('/api/air-quality', (req, res) => {
  res.json(getAirQualityData());
});

// New Gemini chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'Please enter a message.'
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: 'Message is too long. Please keep it under 2000 characters.'
      });
    }

    const airQuality = getAirQualityData();

    const prompt = `
You are BreathBetter, a friendly family-focused air quality assistant.

Your responsibilities:
1. Help families understand air pollution.
2. Suggest practical ways to reduce exposure.
3. Give advice about children, elderly family members,
   outdoor activities and indoor air quality.
4. Use simple, supportive language.
5. Never invent air-quality readings.
6. Do not diagnose medical conditions or replace medical advice.

CURRENT AIR QUALITY CONTEXT:
${JSON.stringify(airQuality)}

IMPORTANT:
These readings are demonstration data, not verified live measurements.
Make that clear whenever you refer to them.
Do not present them as current real-world conditions.

USER QUESTION:
${message}

Give a helpful, concise answer with practical actions.
`;

   
let response;
const maxRetries = 2;

for (let attempt = 0; attempt <= maxRetries; attempt++) {
  try {
    response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    break;

  } catch (error) {
    const isTemporary =
      error.status === 503 ||
      error.status === 429 ||
      error.status === 500;

    if (!isTemporary || attempt === maxRetries) {
      throw error;
    }

    const waitTime = 1000 * Math.pow(2, attempt);

    console.log(
      `Gemini temporarily unavailable. Retrying in ${waitTime / 1000}s...`
    );

    await new Promise(resolve =>
      setTimeout(resolve, waitTime)
    );
  }
}

res.json({
  reply: response.text
});


    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error('Gemini API error:', error.message);

    res.status(500).json({
      error: 'Sorry, the AI assistant could not respond. Please try again.'
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
