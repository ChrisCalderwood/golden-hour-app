/**
 * index.js
 * Main server entry point for the Golden Hour Calculator backend.
 * 
 * Responsibilities:
 * - Sets up Express server with middleware
 * - Loads environment variables
 * - Mounts routing modules for /api/golden-hour and /api/geocode
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const goldenHourRoutes = require('./routes/goldenHour');
const geocodeRoutes = require('./routes/geocode');

dotenv.config(); // Load .env file variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount both route files at /api
app.use('/api', goldenHourRoutes);
app.use('/api', geocodeRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Start server
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});