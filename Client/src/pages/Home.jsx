import React,{useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className="mt-4 md:mt-10 flex items-center justify-center">
        <div className="py-6 text-white w-3/4 flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-4xl font-semibold text-center">
            Welcome to ChatBridge - Your Ultimate Real-Time Messaging Platform
          </h1>
          <p className="py-2 text-sm md:text-xl text-center ">
            Experience seamless and dynamic communication with Chatbridge, a
            cutting-edge chat application built with the powerful MERN stack
            (MongoDB, Express.js, React, and Node.js) and enhanced by
            WebSockets. Whether you are connecting with friends, family, or
            colleagues, Chatbridge provides a reliable, real-time messaging
            solution that combines modern design with robust functionality. Join
            us and transform the way you chat, sharing messages instantly with
            features designed for today&apos;s fast-paced digital world.
          </p>
          <p className="py-2 text-sm md:text-xl text-center ">
            If its your first time here please <span className='font-bold cursor-pointer'><Link to="/register">Register</Link></span> or if you are an old
            user just <span className='font-bold cursor-pointer'><Link to="/login">Sign-In</Link></span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
