const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const goldenHourRoutes = require('./routes/goldenHour');
const geocodeRoutes = require('./routes/geocode');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Mount both route files at /api
app.use('/api', goldenHourRoutes);
app.use('/api', geocodeRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});