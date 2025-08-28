const express = require("express");
const cors = require("cors");
const WeatherData = require('./Models/WeatherForecast');
const mongoose = require('mongoose');
const weatherRoutes = require('./Routes/router');

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/weatherForecast",{
  useUnifiedTopology : true,
  useNewUrlParser : true
}).then(()=>{
  console.log("Mongo Db connected successfully");
}).catch((err)=>{
  console.error("error : ", err);
})
// const weatherRoutes = require('./Routes/3hrroute');

app.use("/", weatherRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

