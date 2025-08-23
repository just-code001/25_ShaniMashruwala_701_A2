const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

// Fetch weather from Open-Meteo API
app.post("/weather", async (req, res) => {
  const city = req.body.city;

  try {
    // Step 1: Get latitude & longitude from Open-Meteo Geocoding API
    const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    
    if (!geoRes.data.results || geoRes.data.results.length === 0) {
      return res.render("index", { weather: null, error: "City not found!" });
    }

    const { latitude, longitude, name, country } = geoRes.data.results[0];

    // Step 2: Get current weather
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    const weather = weatherRes.data.current_weather;

    res.render("index", {
      weather: {
        city: `${name}, ${country}`,
        temperature: weather.temperature,
        windspeed: weather.windspeed,
      },
      error: null
    });
  } catch (error) {
    res.render("index", { weather: null, error: "Something went wrong!" });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
