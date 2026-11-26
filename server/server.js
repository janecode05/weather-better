
require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const app = express();

app.use(express.json());
app.set('etag', false);

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is missing from backend .env');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
const PORT = process.env.PORT || 3000;

app.use(cors());


async function getAirQualityData() {
  const latitude = 13.0827;
  const longitude = 80.2707;

  const airQualityUrl =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=us_aqi,pm2_5,pm10` +
    `&timezone=Asia%2FKolkata`;

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m` +
    `&timezone=Asia%2FKolkata`;

  const [airQualityResponse, weatherResponse] =
    await Promise.all([
      fetch(airQualityUrl),
      fetch(weatherUrl)
    ]);

  if (!airQualityResponse.ok || !weatherResponse.ok) {
    throw new Error('Unable to fetch live air-quality data');
  }

  const airQualityData = await airQualityResponse.json();
  const weatherData = await weatherResponse.json();

  const currentAir = airQualityData.current;
  const currentWeather = weatherData.current;

  const aqi = currentAir.us_aqi;

  let status;

  if (aqi <= 50) {
    status = 'Good';
  } else if (aqi <= 100) {
    status = 'Moderate';
  } else if (aqi <= 150) {
    status = 'Unhealthy for Sensitive Groups';
  } else if (aqi <= 200) {
    status = 'Unhealthy';
  } else if (aqi <= 300) {
    status = 'Very Unhealthy';
  } else {
    status = 'Hazardous';
  }

  return {
    city: 'Chennai',
    aqi: aqi,
    status: status,
    temperature: currentWeather.temperature_2m,
    humidity: currentWeather.relative_humidity_2m,
    pm25: currentAir.pm2_5,
    pm10: currentAir.pm10,
    updatedAt: currentAir.time,
    source: 'Open-Meteo'
  };
}



app.get('/api/airquality', async (req, res) => {
  try {
    const data = await getAirQualityData();

    return res.json(data);

  } catch (error) {
    console.error('Air quality API error:', error.message);

    return res.status(502).json({
      error: 'Unable to retrieve air-quality data right now.'
    });
  }
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
    const airQuality = await getAirQualityData();
    const prompt = ` You are WeatherBetter, an AI air quality assistant. Current air quality context:
      ${JSON.stringify(airQuality)}
      IMPORTANT:
      These readings are demo data, not verified live measurements.
      User question:
      ${message}`;
    let response;
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt
        });
        break;
      } catch (error) {
        const isTemporary = error.status === 503 || error.status === 429 || error.status === 500;
        if (!isTemporary || attempt === 2) {
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

  } 
  catch (error) {
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



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
