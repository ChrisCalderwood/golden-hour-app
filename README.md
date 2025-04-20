# Golden Hour Calculator

This web application calculates the morning and evening golden hour times for a given date and location. Users can enter a city name, GPS coordinates, or use their auto-detected location to get accurate golden hour data.

---

## Features

- Accepts **city names** or **latitude/longitude coordinates**
- "Use My Location" feature via **Geolocation API**
- Date picker to find golden hour times on **any date**
- Responsive UI with animated results
- Real-time communication with a Node.js + Express backend
- Returns both **morning** and **evening** golden hour intervals

---

## Technologies Used

### Frontend
- **React**: Functional components with `useState` and `useEffect` hooks
- **CSS**: Custom responsive styles and animations
- **Geolocation API**: Retrieves device location
- **Fetch API**: Makes async calls to backend RESTful endpoints

### Backend
- **Node.js + Express**: Handles API endpoints and logic
- **SunCalc**: Calculates sunrise, sunset, and golden hour
- **Axios**: Fetches location coordinates from OpenCage API
- **dotenv**: Loads API keys from environment variables

---

## Project Structure

golden-hour-app/ ├── client/ # React frontend ├── server/ # Express backend │ ├── routes/ │ │ ├── geocode.js # OpenCage geocoding route │ │ └── goldenHour.js # SunCalc golden hour route │ └── .env # API key stored here ├── public/ # Static files (e.g., background image) └── README.md

yaml
Copy
Edit

---

## How to Run the App Locally

1. **Clone this repo:**
```bash
git clone https://github.com/your-username/golden-hour-app.git
cd golden-hour-app

2. **Install dependencies:**
```bash
npm install
cd client && npm install
cd ../server && npm install

3. **Set your OpenCage API key in server/.env:**
.env
OPENCAGE_API_KEY=your_api_key_here

4. **Start the app:**
In your terminal, run:
```bash
npm start

The client runs on http://localhost:3000
The server runs on http://localhost:5050

## Future Improvements
1. Responsive layout tweaks for all screen sizes and orientations
2. Save & display previous search results
3. Deploy the app to a public host (like Render, Netlify, or Vercel)

## License
This project is for academic purposes. MIT License.

## Acknowledgements
**SunCalc** for astronomical calculations

**OpenCage Geocoder** for forward geocoding
