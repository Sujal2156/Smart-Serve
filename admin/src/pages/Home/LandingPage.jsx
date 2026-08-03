import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [greeting, setGreeting] = useState("");

  const slides = [
    "images.unsplash.com/photo-1497215728101-856f4ea42174",
    "images.unsplash.com/photo-1497366216548-37526070297c",
    "images.unsplash.com/photo-1497366811353-6870744d04b2",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen overflow-y-scroll">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src={assets.logo}
              alt="Logo"
              className="w-8 h-8 md:w-10 md:h-10 object-cover"
            />
            <span className="text-lg md:text-xl font-bold text-gray-800">
              SmartServe
            </span>
          </div>
          <Link to="/login">
            <button className="px-4 py-2 md:px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300">
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* Sections Wrapper */}
      <div className="pt-16">
        {/* Hero Section */}
        <section
          className="h-screen relative bg-cover bg-fixed"
          style={{
            backgroundImage: `url(https://${slides[currentSlide]})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4 text-center">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4">
              {greeting}!
            </h1>
            <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold mb-4">
              Admin Panel
            </h1>
            <div className="flex flex-col md:flex-row gap-4">
              <Link to="/register">
                <button className="px-6 py-3 md:px-8 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300">
                  Create Restaurant
                </button>
              </Link>
              <Link to="/login">
                <button className="px-6 py-3 md:px-8 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors duration-300">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer
          className="py-12 bg-gray-900 text-white text-center"
        >
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex justify-center mb-4">
              <img
                src={assets.logo}
                alt="SmartServe Logo"
                className="h-24 w-24 object-contain"
              />
            </div>
            <p className="text-sm font-semibold">SmartServe Restaurant Management System</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
