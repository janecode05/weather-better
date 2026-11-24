
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Sample air-quality API
app.get('/api/air-quality', (req, res) => {

  const airQualityData = {
    city: 'Chennai',
    aqi: 100,
    status: 'Moderate',
    temperature: 29,
    humidity: 68,
    pm25: 65,
    recommendation:
      'Reduce strenuous outdoor activity and keep windows closed during periods of high pollution.'
  };

  res.json(airQualityData);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
