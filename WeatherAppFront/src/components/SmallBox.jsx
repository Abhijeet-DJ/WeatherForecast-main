import React from 'react'

function SmallBox({ url , name , val , addStyle }) {
  return (
    <div className={`flex flex-row justify-center items-center ${addStyle} flex-wrap rounded-xl m-1 py-5 bg-transparent inset-shadow-sm inset-shadow-sky-800`} >
      <img src={url} alt={name + "logo"} height={55} width={55} />
      <span className='text-4xl font-bold text-gray-700 mb-3 ' >
        { name }
      </span>
      <h1 className='text-6xl font-extrabold text-white text-center align-center' >
        { val }
      </h1>
    </div>
  )
}

export default SmallBox
