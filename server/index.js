const express = require('express');
const cors = require('cors');
const SunCalc = require('suncalc');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5050;

app.post('/api/golden-hour', (req, res) => {
  const { latitude, longitude, date } = req.body;

  if (!latitude || !longitude || !date) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const times = SunCalc.getTimes(new Date(date), latitude, longitude);

    const morningGoldenHourStart = times.sunrise;
    const morningGoldenHourEnd = times.goldenHourEnd;
    const eveningGoldenHourStart = times.goldenHour;
    const eveningGoldenHourEnd = times.sunset;

    res.json({
      morning: { start: morningGoldenHourStart, end: morningGoldenHourEnd },
      evening: { start: eveningGoldenHourStart, end: eveningGoldenHourEnd }
    });
  } catch (error) {
    console.error('Error calculating golden hours:', error);
    res.status(500).json({ error: 'Failed to calculate golden hours.' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});