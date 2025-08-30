import React from 'react'

function HorBox({ addStyle, children, name, val, url }) {
  let arr;
  if (children) {
    return (
      <div className={`flex flex-row justify-center items-center bg-transparent rounded-xl ${addStyle} inset-shadow-sm inset-shadow-sky-800`} >
        {children}
      </div>
    )
  }
  return (
    <div className={`flex flex-row justify-around items-center bg-transparent rounded-xl ${addStyle} flex-wrap inset-shadow-sm inset-shadow-sky-800`} >
      <img src={url} alt={name + "logo"} height={55} width={55} />
      <span className='text-4xl font-bold text-gray-700 m-0 p-0' >
          {name}
      </span>
      <div className='flex flex-col justify-evenly items-around  '>
        {val && Object.values(val).map((value) => (
          <span key={value} className="text-white text-8xl font-extrabold leading-12 ">
              {value.split("/")[0] }/<span className='text-6xl'> {value.split("/")[1]} </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default HorBox
