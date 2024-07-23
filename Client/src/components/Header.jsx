import React from 'react';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <div className="w-full flex items-center justify-center top-0">
     
      <div className="px-2 md:px-3 py-3 w-[90%] flex item justify-between text-white">
      <Link to={"/"}>
        <div className=" flex items-center">
          <span className="mt-1 text-xl md:text-3xl">
            <ion-icon name="chatbubbles"></ion-icon>
          </span>
          <h1 className="text-xl md:text-2xl font-medium">ChatBridge</h1>
        </div>
        </Link>
        <div className="flex items-center cursor-pointer">
          <a href="https://github.com/Prakhar301101/ChatBridge-Client">
            <h1 className="text-xl md:text-2xl font-medium">Github</h1>
          </a>
          <div className="text-xl md:text-3xl ">
            <ion-icon name="logo-github"></ion-icon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
