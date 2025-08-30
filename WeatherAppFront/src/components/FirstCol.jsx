
import React, { useState, useEffect } from "react";
import SmallBox from './SmallBox'
import HorBox from './HorBox'

function FirstCol({ children }) {
  const [weather, setWeather] = useState(null);
  if (children) {
    return (
      <div className='flex felx-col justify-evenly items-center w-3/10 h-[calc(100vh-4em)] flex-wrap ' >
        {children}
      </div>
    )
  }

  useEffect(() => {
    fetch("http://localhost:5000/api/weather")
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend weather response FirstCol:", data);
        setWeather(data);
      })
      .catch((err) => console.error("Error fetching weather:", err));
  }, []);

  // console.log("weather" , weather?.data[0]?.list[0].wind.gust);
  
  return (
    <div className='flex felx-col justify-evenly items-center w-3/10 h-[calc(100vh-4em)] flex-wrap ' >
      <SmallBox url={"humidity-svgrepo-com.png"} name={"Hum(%)"} val={`${weather?.data[0]?.list[0]?.main?.humidity ?? 0}%`}
        addStyle={"w-55 h-55"} />
      <SmallBox url={"temperature-svgrepo-com.svg"} name={"Temp(°C)"} val={`${weather?.data[0]?.list[0].main.temp.toFixed(1) ?? 0}°C`} addStyle={"w-55 h-55"} />


      <HorBox name={"Wind / Gust"} val={{
    "Wind/Gust": `${weather?.data[0]?.list[0].wind?.speed ?? 0}/${weather?.data[0]?.list[0].wind?.gust ?? 0} kmph`,
  }} addStyle={"w-110 h-70"} url={"wind-svgrepo-com (1).svg"} />


      <HorBox name={"UV / Visbility"} val={{
    "uv/Vis": `${weather?.data[0]?.list?.[0]?.uv ?? 0}/${weather?.data[0]?.list?.[0]?.visibility ?? 0}`,
  }}  addStyle={"w-110 h-70 pb-10"} url={"sun-radiation-symbol-svgrepo-com.svg"} />
    </div>
  )
}

export default FirstCol
