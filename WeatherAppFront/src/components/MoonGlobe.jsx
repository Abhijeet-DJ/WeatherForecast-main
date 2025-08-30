import React from 'react'

const MoonGlobe = ({ addStyle, name, val }) => {
  return (
    <div className={`flex flex-row justify-around items-center bg-transparent rounded-xl ${addStyle} flex-wrap inset-shadow-sm inset-shadow-sky-800 pb-3 `} >
      <div className='flex flex-row justify-between items-center  ' >
        <img src="diurnal-unscreen.gif" alt="moon" height={160} width={160} className={'mx-7'} />
        <span className='text-4xl font-bold text-gray-700 m-0 p-0 flex flex-row flex-wrap align-left justify-start items-center w-[50%] ' >
          {name}
        </span>
      </div>
      <div className='mb-8' >
        {val && Object.keys(val).map((key) => (
          <span key={key} className='text-white text-4xl font-extrabold '>
            {key} : {val[key]}
            <hr />
          </span>
        ))}
      </div>
    </div>
  )
}

export default MoonGlobe
