import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; // Assuming you have a Header component

const IndexPage = () => {
  const slides = [
    {
      title: "Welcome Back to Our Appliance Store!",
      description: "Explore our exclusive collection of high-quality appliances designed to make life easier and more enjoyable.",
      imageUrl: "/images/welcome.jpg", // Replace with your appliance image URL
    },
    {
      title: "Discover Latest Innovations!",
      description: "Stay up to date with the latest appliances and technologies designed to enhance your home experience.",
      imageUrl: "/images/welcome1.jpg", // Replace with another image URL
    },
    {
      title: "Exclusive Deals Just for You!",
      description: "Take advantage of our special discounts and offers on a wide range of home appliances.",
      imageUrl: "/images/welcome2.jpg", // Replace with another image URL
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [textVisible, setTextVisible] = useState(false); // Controls the text visibility

  const nextSlide = () => {
    setTextVisible(false); // Hide text immediately when transitioning
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setTextVisible(false); // Hide text immediately when transitioning
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    // Show text after the slide changes, with a delay of 1 second (1000ms)
    const timer = setTimeout(() => {
      setTextVisible(true); // Show text after 1 second
    }, 1000);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount or slide change
  }, [currentSlide]); // Trigger the effect when the currentSlide changes

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-stone-200">
        <div className="relative w-full h-96 overflow-hidden">
          {/* Slider Container */}
          <div className="relative w-full h-full">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              />
            ))}

            <div className="absolute inset-0 bg-black opacity-20"></div>

            {/* Text Container with Left-to-Right Slide Transition */}
            <div
              className={`absolute z-10 w-full max-w-3xl pl-8 text-white space-y-6 pt-20 transition-transform duration-500 transform ${
                textVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}
            >
              <h1 className="text-3xl font-bold">{slides[currentSlide].title}</h1>
              <p className="text-lg">{slides[currentSlide].description}</p>
              <div className="text-left mt-4">
                <p className="text-base">
                  Have any questions?{' '}
                  <Link to="/contact" className="text-indigo-400 hover:underline">Contact us</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
          >
            &#60;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
          >
            &#62;
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
