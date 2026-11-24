
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



app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate user message
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'Please enter a message.'
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: 'Message is too long. Maximum 2000 characters.'
      });
    }

    const airQuality = getAirQualityData();

    const prompt = `
      You are WeatherBetter, an AI air quality assistant.

      Help families understand pollution and protect their health.
      Give simple, practical and family-friendly advice.

      Current air quality context:
      ${JSON.stringify(airQuality)}

      IMPORTANT:
      These readings are demo data, not verified live measurements.
      Never describe them as real-time readings.

      User question:
      ${message}
    `;

    let response;

    // Retry temporary Gemini errors
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
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
          `Gemini temporarily unavailable. Retrying in ${waitTime / 1000} seconds...`
        );

        await new Promise(resolve =>
          setTimeout(resolve, waitTime)
        );
      }
    }

    // Send exactly one successful response
    return res.status(200).json({
      reply: response.text
    });

  } catch (error) {
    console.error('Gemini API error:', error.message);

    // Avoid sending another response if headers were already sent
    if (res.headersSent) {
      return;
    }

    return res.status(500).json({
      error: 'Sorry, the AI assistant is temporarily unavailable. Please try again.'
    });
  }
});


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
