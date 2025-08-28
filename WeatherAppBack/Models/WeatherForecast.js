const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  dt: { type: Number, required: true },
  main: {
    temp: Number,
    feels_like: Number,
    temp_min: Number,
    temp_max: Number,
    pressure: Number,
    sea_level: Number,
    grnd_level: Number,
    humidity: Number,
    temp_kf: Number,
  },
  weather: [
    {
      id: Number,
      main: String,
      description: String,
      icon: String,
    }
  ],
  clouds: {
    all: Number,
  },
  wind: {
    speed: Number,
    deg: Number,
    gust: Number,
  },
  uv: {
    type : Number,
    required : true
  },
  alt : {
    type : Number,
    required : true
  },
  pre : Number,
  aqi:Number,
  visibility: Number,
  pop: Number,
  rain: {
    "3h": Number, 
  },
  sys: {
    pod: String,
  },
  dt_txt: String,
});

const ForecastSchema = new mongoose.Schema({
  cod: String,
  message: Number,
  cnt: Number,
 
  city: {
    name: { type: String, required: true }, 
    country: String,
  },
  list: [WeatherSchema],
});


module.exports = mongoose.model('Forecast', ForecastSchema);
