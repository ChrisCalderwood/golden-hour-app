/**
 * goldenHour.js
 * Express route to calculate golden hour times using SunCalc.
 * 
 * POST /api/golden-hour
 * Expects: { latitude, longitude, date }
 * Returns: { morning: {start, end}, evening: {start, end} }
 */

const express = require('express');
const SunCalc = require('suncalc');

const router = express.Router();

router.post('/golden-hour', (req, res) => {
  const { latitude, longitude, date } = req.body;

  // Validate required fields
  if (!latitude || !longitude || !date) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Use SunCalc to calculate times
    const times = SunCalc.getTimes(new Date(date), latitude, longitude);
    const morning = { start: times.sunrise, end: times.goldenHourEnd };
    const evening = { start: times.goldenHour, end: times.sunset };

    res.json({ morning, evening });
  } catch (error) {
    console.error('Golden hour error:', error);
    res.status(500).json({ error: 'Failed to calculate golden hours.' });
  }
});

module.exports = router;