import React, { useState, useEffect } from "react";
import FirstCol from './components/FirstCol'
import SmallBox from './components/SmallBox'
import HorBox from './components/HorBox'
import Footer from './components/Footer'
import Globe from './components/Globe'
import MoonGlobe from './components/MoonGlobe'


function App() {
  const [weather, setWeather] = useState(null);
  const [dt, setDt] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setDt(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const date = dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  // Update date & time every second
  useEffect(() => {
    const t = setInterval(() => setDt(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  // Inside App component

  useEffect(() => {
    fetch("http://localhost:5000/weather/3hrs")
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend weather response App:", data);
        console.log("data" ,data);
        
        setWeather(data);
      })
      .catch((err) => console.error("Error fetching weather:", err));
  }, []);

  
  
  return (
    <div className='font-sans'>
      <div className="flex justify-between items-center bg-sky-600 pb-1 text-white">
        <span className="text-5xl font-extrabold pl-25">{date}</span>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-gray-700 text-6xl font-extrabold">
          KIT Campus
        </h1>
        <span className="text-5xl font-extrabold pr-25">{time}</span>
      </div>
      <div className='bg-linear-to-b from-sky-600  via-sky-400 t0-50% to-sky-300 h-[calc(100vh-4rem)] w-screen flex flex-row justify-evenly items-center  flex-wrap' >
        <FirstCol />

        <FirstCol>
          <Globe textureUrl="/textures/globe.jpg" style={{ height: 300 }} />

          <MoonGlobe addStyle={"w-130 h-90"} name={"Moon - Wanning Gibbous"} val={
            {
              "Illumination": "87%",
              "Moonrise": "20:00",
              "Next Full Moon": "10days"
            }
          } />
          {/* <HorBox name={"Moon Phase"} addStyle={"w-110 h-100 "} url={"moon-svgrepo-com.svg"} val={
            {
              "Illumination": "87%",
              "Moonrise": "20:00",
              "Next Full Moon": "10days"
            }
          } /> */}

        </FirstCol>

        <FirstCol>
          <HorBox val={{
            "HourlyTemps": weather?.list[0].Hourly
          }} addStyle={"w-120 h-70"}>
            <div className='flex flex-col justify-evenly gap-5 items-start ' >
              <h1 className='text-5xl font-extrabold text-gray-700 ' >Hourly Forecast</h1>
              <div>
                  { weather?.Hourly.map((item) =>(
                  <span className='text-white text-5xl font-extrabold w-100 align-left m-1 ' >
                  {`${item.toFixed(1)+"°C"}`}
                  </span>
                  )) }
              </div>
                
              
            </div>
          </HorBox>
          <SmallBox url={"pressure-meter-svgrepo-com.svg"} name={"Pres(hpa)"} val={`${weather?.list[0].main.pressure ?? 0}`} addStyle={"w-55 h-60 pb-8 "} />
          <SmallBox url={"altitude-svgrepo-com.png"} name={"Alt(m)"} val={`${weather?.list?.[0].main?.sea_level ?? 0}`} addStyle={"w-55 h-60 pb-8"} />
          <SmallBox url={"man-ventilating-svgrepo-com.svg"} name={"AQI"} val={`${weather?.list[0]?.aqi}`} addStyle={"w-55 h-60 pb-10"} />
          <SmallBox url={"rain-season-snow-svgrepo-com.svg"} name={"Pre(mm)"} val={`${weather?.list?.[0]?.pre}`} addStyle={"w-55 h-60 pb-10 "} />
        </FirstCol>
        <Footer weather={weather} />
      </div>

    </div>
  )
}

export default App
