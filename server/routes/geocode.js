/**
 * geocode.js
 * Express route to handle geocoding requests using the OpenCage API.
 * 
 * GET /api/geocode?city=<cityname/coordinates>
 * Returns latitude and longitude for the given city.
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/geocode', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.OPENCAGE_API_KEY;

  // Validate input and API key
  if (!city || !apiKey) {
    return res.status(400).json({ error: 'Missing query or API key' });
  }

  try {
    // Forward geocode using OpenCage API
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
      params: {
        q: city,
        key: apiKey
      }
    });

    // Extract lat/lng from first result
    const { lat, lng } = response.data.results[0].geometry;
    res.json({ latitude: lat, longitude: lng });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});
  
module.exports = router;
  