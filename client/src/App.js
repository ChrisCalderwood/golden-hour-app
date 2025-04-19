import React, { useState, useEffect } from "react";
import "./App.css"

function App() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [autoLocation, setAutoLocation] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goldenHour, setGoldenHour] = useState(null);
  const backgroundStyle = {
    backgroundImage: 'url("/sunset.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
  };


  // Try to get user's location automatically
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
          setAutoLocation(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    let lat, lon;
  
    if (!location) {
      alert("Please enter a location.")
      return;
    }
    if (!date) {
      alert("Please select a date.");
      return;
    }

    try {
      const trimmedLocation = location.trim();
      const geoRes = await fetch(`http://localhost:5050/api/geocode?city=${encodeURIComponent(trimmedLocation)}`);
      const geoData = await geoRes.json();
      if (!geoRes.ok || !geoData.latitude || !geoData.longitude) {
        throw new Error("Invalid geocode response");
      }
      lat = geoData.latitude;
      lon = geoData.longitude;
    } catch (err) {
      alert("We couldn’t find that location. Try entering a city name like 'Paris' or coordinates like '48.8566,2.3522'.");
      console.error(err);
      return;
    }    

    try {
      const response = await fetch('http://localhost:5050/api/golden-hour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lon, date })
      });

      if (!response.ok) throw new Error("Failed to fetch golden hour data");
  
      const data = await response.json();
      setGoldenHour(data);
      setShowResult(true); // ensure the result shows
    }
    catch (err) {
      alert("There was an error fetching data. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };
  

  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    setShowResult(false);
    setGoldenHour(null);
  }, [location, date]);

  return (
    <div style={backgroundStyle}>
      <div className="container">
        <div className="card">
          <h1>
            <span className="icon">☀️</span> Golden Hour Calculator
          </h1>

          <form onSubmit={handleSubmit} disabled={loading}>

            <label>Location (City or Coordinates)</label>
            <div className="location-input-wrapper">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, NY or 40.7128,-74.0060"
              />
              {autoLocation && (
                <button
                  type="button"
                  onClick={() => setLocation(autoLocation)}
                  className="use-location-button"
                >
                  Use My Location
                </button>
              )}
            </div>

            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button type="submit" disabled={loading}>Calculate</button>
            {loading && (
              <div className="flex justify-center mt-4">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
              </div>
            )}

            {showResult && (
              <div className="result-card">
                {goldenHour && (
                  <div className="bg-white shadow-lg rounded-2xl p-4 mt-6 w-full max-w-md mx-auto transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
                      Golden Hour Results for {date}
                    </h2>

                    <div className="mb-3">
                      <h3 className="font-medium text-gray-700">🌅 Morning Golden Hour</h3>
                      <p className="text-gray-600">
                        {formatTime(goldenHour.morning.start)} – {formatTime(goldenHour.morning.end)}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">🌇 Evening Golden Hour</h3>
                      <p className="text-gray-600">
                        {formatTime(goldenHour.evening.start)} – {formatTime(goldenHour.evening.end)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>

          {autoLocation && (
            <p className="auto-location">
              Auto-detected location: {autoLocation}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;

