import React from 'react'

const Logo = () => {
  return (
    <div className="flex gap-1 items-center justify-center p-2 md:px-4 md:py-3">
    <h1 className="text-white font-bold text-center text-xs sm:text-xl md:text-3xl">
      Contacts
    </h1>
    <span className="text-white  md:text-2xl lg:text-3xl ">
      <ion-icon name="contacts"></ion-icon>
    </span>
  </div>
  )
}

export default Logo