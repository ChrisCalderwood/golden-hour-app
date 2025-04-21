/**
 * App.js
 * Main React component for the Golden Hour Calculator app.
 * 
 * Allows users to enter a location and date, fetches golden hour data
 * from the backend server, and displays the morning and evening golden hours.
 * 
 * Uses:
 * - Geolocation API for optional auto-location
 * - RESTful API (fetch) to communicate with backend
 * - Conditional rendering and React hooks (useState, useEffect)
 */
import React, { useState, useEffect } from "react";
import "./App.css"

function App() {
  // State variables
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [autoLocation, setAutoLocation] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goldenHour, setGoldenHour] = useState(null);
  
  // Background Style
  const backgroundStyle = {
    backgroundImage: 'url("/sunset.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
  };


  // Automatically detect user location on load
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

  // Handle form submission
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

    // Fetch geocoding data
    try {
      const trimmedLocation = location.trim();
      const geoRes = await fetch(
        `http://localhost:5050/api/geocode?city=${encodeURIComponent(trimmedLocation)}`
      );
      const geoData = await geoRes.json();
      if (!geoRes.ok || !geoData.latitude || !geoData.longitude) {
        throw new Error("Invalid geocode response");
      }
      lat = geoData.latitude;
      lon = geoData.longitude;
    } catch (err) {
      alert(
        "We couldn’t find that location. Try entering a city name like 'Paris' or coordinates like '48.8566,2.3522'."
      );
      console.error(err);
      return;
    }    

    // Fetch golden hour data
    try {
      const response = await fetch('http://localhost:5050/api/golden-hour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lon, date }),
      });

      if (!response.ok) throw new Error("Failed to fetch golden hour data");
  
      const data = await response.json();
      setGoldenHour(data);
      setShowResult(true);
    }
    catch (err) {
      alert("There was an error fetching data. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };
  
  // Change ISO time to HH:MM format
  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Reset result when location or date changes
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

          {/* Main form for user input */}
          <form onSubmit={handleSubmit} disabled={loading}>

            {/* Location input section */}
            <label>Location (City or Coordinates)</label>
            <div className="location-input-wrapper">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, NY or 40.7128,-74.0060"
              />

              {/* Optional button to autofill location from geolocation API */}
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

            {/* Date input */}
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {/* Submit button (disabled while loading) */}
            <button type="submit" disabled={loading}>Calculate</button>

            {/* Loading spinner while waiting for API response */}
            {loading && (
              <div className="flex justify-center mt-4">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
              </div>
            )}

            {/* Show golden hour results only if API returned data */}
            {showResult && (
              <div className="result-card">
                {goldenHour && (
                  <div className="bg-white shadow-lg rounded-2xl p-4 mt-6 w-full max-w-md mx-auto transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
                      Golden Hour Results for {date}
                    </h2>

                    {/* Morning golden hour */}
                    <div className="mb-3">
                      <h3 className="font-medium text-gray-700">🌅 Morning Golden Hour</h3>
                      <p className="text-gray-600">
                        {formatTime(goldenHour.morning.start)} – {formatTime(goldenHour.morning.end)}
                      </p>
                    </div>

                    {/* Evening golden hour */}
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

          {/* Display auto-detected coordinates for transparency */}
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

