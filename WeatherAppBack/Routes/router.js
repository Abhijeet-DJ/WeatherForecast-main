const express = require("express");
const axios = require("axios");
const WeatherData = require("../Models/WeatherForecast");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(201).json({
    message: "Server is working",
    status: 201,
  });
});

router.get("/api/weather", async (req, res) => {
  try {
    const city = "brahmapur";
    const apiKey = "c0b49a09f08041dffc3c34e59540b992";
    const urlOpenW = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(urlOpenW);
    const weatherInfo = response.data;

    // const  data = await WeatherData.find({ "city.name": city })
    // let aqiEntry = data[0].list[0];
    // // console.log({aqi : aqi , pre : pre});
    // console.log(aqiEntry["0"].aqi);
    
    
    // Prepare the fields to update
    const updateFields = {};
   updateFields["list.0.main.temp"] =
      req.query.temp ?? weatherInfo.list[0].main.temp;
    updateFields["list.0.main.humidity"] =
      req.query.hum ?? weatherInfo.list[0].main.hum;
    updateFields["list.0.main.pressure"] =
      req.query.pres ?? weatherInfo.list[0].main.pres;
    updateFields["list.0.visibility"] =
      req.query.vis ?? weatherInfo.list[0].main.vis;
    updateFields["list.0.uv"] = req.query.uv ?? weatherInfo.list[0].main.uv;
    updateFields["list.0.main.sea_level"] =
      req.query.alt ?? weatherInfo.list[0].main.alt;
    updateFields["list.0.wind.gust"] =
      req.query.gust ?? weatherInfo.list[0].main.gust;
    updateFields["list.0.wind.speed"] =
      req.query.speed ?? weatherInfo.list[0].main.speed;
      updateFields["list.0.pre"]=req.query?.pre ?? 0;
    updateFields["list.0.aqi"]=req.query.aqi ?? 0;

    // Update or insert weather data
    const updatedWeather = await WeatherData.findOneAndUpdate(
  { "city.name": city },
  { $set: {...weatherInfo} , $set: {...updateFields} }, 
  // { $set: { ...weatherInfo, ...updateFields } }, 
  { new: true, upsert: true }
);

    res.status(200).json({
      message: "Weather data updated successfully",
      data: updatedWeather,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch or update weather data" });
  }
});



// Test route
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Weather API is working",
    status: 200,
  });
});

// Weather route
router.get("/weather/3hrs", async (req, res) => {
  const city = "brahmapur";
  const apiKey = "c0b49a09f08041dffc3c34e59540b992";
  const urlOpenW = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // 1️⃣ Fetch from OpenWeather API
    const response = await axios.get(urlOpenW);
    const weatherInfo = response.data;

    // 2️⃣ Save full API response in MongoDB
    const updatedWeather = await WeatherData.findOneAndUpdate(
      { "city.name": city },
      { $set: weatherInfo },
      { new: true, upsert: true }
    );

    // 3️⃣ Extract last 3 hourly temps
    const last3Temps = updatedWeather.list
      ?.slice(0, 3)
      .map(item => `${item.main.temp}°C`) || [];

    return res.status(200).json({
      message: "Weather data updated successfully",
      temps: last3Temps.join(" "),
    });

  } catch (err) {
    console.error("API fetch failed, returning last stored data:", err.message);

    // 4️⃣ Fallback to MongoDB
    try {
      const storedWeather = await WeatherData.findOne({ "city.name": city });

      if (!storedWeather || !storedWeather.list) {
        return res.status(500).json({
          error: "No stored weather data available yet. Try again after first successful fetch."
        });
      }

      const last3Temps = storedWeather.list
        .slice(0, 3)
        .map(item => `${item.main.temp}°C`);

      return res.status(200).json({
        message: "API fetch failed, returning last stored weather data",
        temps: last3Temps.join(" "),
      });

    } catch (mongoErr) {
      console.error("MongoDB error:", mongoErr.message);
      return res.status(500).json({ error: "Failed to fetch weather data from DB" });
    }
  }
});

module.exports = router;
