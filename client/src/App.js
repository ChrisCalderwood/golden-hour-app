import React, { useState, useEffect } from "react";
import "./App.css"

function App() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [autoLocation, setAutoLocation] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goldenHour, setGoldenHour] = useState(null);


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
    setShowResult(false); // hide old result while fetching new one
  
    let lat, lon;
  
    // If user typed coordinates (e.g., "40.7128,-74.0060")
    if (location.includes(",")) {
      const parts = location.split(",").map(p => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        lat = parts[0];
        lon = parts[1];
      } else {
        alert("Invalid coordinates format.");
        return;
      }
    } 
    else if (autoLocation) {
      // Use auto-detected coordinates
      const parts = autoLocation.split(",").map(p => parseFloat(p.trim()));
      lat = parts[0];
      lon = parts[1];
    } else {
      alert("Please enter coordinates like '40.7128,-74.0060' or enable location.");
      return;
    }
    if (!date) {
      alert("Please select a date.");
      return;
    }

    setLoading(true);
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

  return (
    <div className="container">
      <div className="card">
        <h1>
          <span className="icon">☀️</span> Golden Hour Calculator
        </h1>

        <form onSubmit={handleSubmit}>
          <label>Location (City or Coordinates)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. New York or 40.7128,-74.0060"
          />

          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button type="submit">Calculate</button>
          {loading && <p className="text-center mt-4 text-gray-500">Loading golden hour times...</p>}

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

        {/* TODO: Add a result card here once we get data back from the backend */}
      </div>
    </div>
  );
}

export default App;

