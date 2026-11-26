# WeatherBetter

WeatherBetter is a web app for checking current air quality and weather conditions in Chennai, India, and getting practical clean-air guidance from an AI assistant.

**Live app:** [frontendweatherbetter.vercel.app/dashboard](https://frontendweatherbetter.vercel.app/dashboard)

## Features

- **Air-quality dashboard:** View the current US AQI and its category, PM2.5 and PM10 levels, temperature, and humidity.
- **AI clean-air assistant:** Ask questions about air quality, outdoor activity, indoor air, and ways to protect your family. Suggested questions are available to get started.
- **Current data:** The backend retrieves air-quality and weather readings from [Open-Meteo](https://open-meteo.com/).
- **Client-routed app:** Navigate between the dashboard and AI assistant.

## Technology

- **Frontend:** Angular 22, TypeScript, and SCSS
- **Backend:** Node.js and Express
- **AI:** Google Gemini API (`@google/genai`)
- **Weather and air-quality data:** Open-Meteo APIs

## Run locally

### Requirements

- Node.js and npm
- A Google Gemini API key to use the AI assistant

### 1. Start the backend

In a terminal:

```bash
cd server
npm install
```

Create `server/.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the API server:

```bash
node server.js
```

The backend listens at `http://localhost:3000`.

### 2. Start the Angular app

In a second terminal, from the project root:

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200). The default route redirects to the dashboard. The frontend calls the backend at `http://localhost:3000`.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/airquality` | Returns current air-quality and weather readings for Chennai. |
| `POST` | `/api/chat` | Sends an air-quality question to the AI assistant. Expects a JSON body such as `{ "message": "Is it safe to exercise outdoors today?" }`. |

## Build and tests

From the project root:

```bash
npm run build
npm test
```

## Deployment

The frontend is deployed at [https://frontendweatherbetter.vercel.app/dashboard](https://frontendweatherbetter.vercel.app/dashboard).
The backend is deployed at [https://backendweatherbetter.vercel.app/](https://backendweatherbetter.vercel.app/).
