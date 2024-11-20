import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; // Assuming you have a Header component

const IndexPage = () => {
  const slides = [
    {
      title: "Transform Your Home with Premium Appliances!",
      description: "Explore our exclusive collection of high-quality appliances designed to make life easier and more enjoyable.",
      imageUrl: "/images/welcome1.png", // Replace with your appliance image URL
    },
    {
      title: "Experience the Future of Home Technology!",
      description: "Stay up to date with the latest appliances and technologies designed to enhance your home experience.",
      imageUrl: "/images/welcome2.png", // Replace with another image URL
    },
    {
      title: "Unbeatable Deals on Must-Have Appliances!",
      description: "Take advantage of our special discounts and offers on a wide range of home appliances.",
      imageUrl: "/images/welcome3.png", // Replace with another image URL
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [textVisible, setTextVisible] = useState(false); // Controls the text visibility

  const nextSlide = () => {
    setTextVisible(false); // Hide text immediately when transitioning
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  useEffect(() => {
    // Automatically change slide every 5 seconds (5000ms)
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    // Cleanup interval on unmount or when currentSlide changes
    return () => clearInterval(interval);
  }, [currentSlide]);

  useEffect(() => {
    // Show text after the slide changes, with a delay of 1 second (1000ms)
    const timer = setTimeout(() => {
      setTextVisible(true); // Show text after 1 second
    }, 1000);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount or slide change
  }, [currentSlide]); // Trigger the effect when the currentSlide changes

  const handleSlideClick = () => {
    nextSlide(); // Manually trigger the next slide when clicked
  };

  const categories = [
    { name: "Kitchen Appliances", imageUrl: "/images/landing1.jpg", description: "Transform your cooking experience with our premium kitchen appliances, from high-performance blenders to advanced ovens designed to make meal prep easy and efficient." },
    { name: "Laundry Appliances", imageUrl: "/images/landing2.jpg", description: "Our laundry appliances are engineered for convenience and efficiency. From washers to dryers, enjoy powerful cleaning and fast drying technology to save you time and energy." },
    { name: "Cleaning Appliances", imageUrl: "/images/landing3.jpg", description: "Discover the latest in cleaning technology. From robotic vacuums to steam cleaners, our products make home cleaning effortless and thorough, ensuring a spotless living space." },
    { name: "Home Comfort Appliances", imageUrl: "/images/landing4.jpg", description: "Create a relaxing, perfect environment in your home with our comfort appliances, including air purifiers, heaters, and humidifiers, designed to provide optimal climate control." },
    { name: "Small Appliances", imageUrl: "/images/landing5.jpg", description: "Compact yet powerful, our small appliances are ideal for day-to-day tasks. Whether you're brewing a cup of coffee or reheating leftovers, these space-saving gadgets are essential for every home." },
    { name: "Personal Care Appliances", imageUrl: "/images/landing6.jpg", description: "Indulge in self-care with our personal care appliances, including hair dryers, electric shavers, and massagers. Designed for comfort, convenience, and quality grooming." },
    { name: "Outdoor Appliances", imageUrl: "/images/landing7.jpg", description: "Make your outdoor experience better with our durable appliances for grilling, gardening, and outdoor cooling. Designed to withstand the elements while providing top-notch performance." },
    { name: "Smart Appliances", imageUrl: "/images/landing8.jpg", description: "Step into the future with our range of smart appliances. From refrigerators that track your groceries to washing machines that can be controlled from your phone, enjoy the convenience of connected home technology." },
  ];

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-stone-200">
        <div className="relative w-full h-[600px] overflow-hidden">
          {/* Slider Container */}
          <div className="relative w-full h-full">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  backgroundImage: `url(${slide.imageUrl})`,
                  backgroundSize: 'cover', // Ensures the image covers the entire container
                  backgroundPosition: 'center', // Centers the image
                  backgroundRepeat: 'no-repeat', // Prevents tiling of the background
                  height: '100%', // Forces the container to take up 100% of the height
                  width: '100%', // Forces the container to take up 100% of the width
                }}
                onClick={handleSlideClick} // Trigger the slide change on click
              />
            ))}

            <div className="absolute inset-0 bg-black opacity-20"></div>

            {/* Text Container with Left-to-Right Slide Transition */}
            <div
              className={`absolute z-10 w-full max-w-3xl pl-8 text-white space-y-6 pt-20 transition-transform duration-500 transform ${
                textVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}
            >
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold">{slides[currentSlide].title}</h1>
              <p className="text-base md:text-lg xl:text-xl">{slides[currentSlide].description}</p>
              <div className="text-left mt-4">
              </div>
            </div>
          </div>
        </div>

        {/* Category Sections with alternating background colors and layout (text and image) */}
        {categories.map((category, index) => (
          <div
            key={index}
            className={`w-full py-20 ${index % 2 === 0 ? 'bg-stone-100' : 'bg-stone-300'}`} // Alternates background colors
          >
            <div className="container mx-auto flex items-center justify-between px-8">
              {/* Alternating layout: text-left on even, text-right on odd */}
              <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'order-1' : 'order-2'}`}>
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-auto object-cover rounded-lg mx-auto" // Ensures image is centered
                />
              </div>
              <div className={`w-full md:w-1/2 pl-8 ${index % 2 === 0 ? 'order-2' : 'order-1'}`}>
                <h2 className="text-3xl font-semibold mb-4">{category.name}</h2>
                <p className="text-lg mb-6">{category.description}</p>
                  <Link
                    to="/products"
                    className="inline-block px-6 py-3 mt-4 text-lg font-semibold text-white bg-slate-700 rounded-lg shadow-lg hover:bg-slate-900 hover:shadow-xl transition-all duration-300"
                  >
                    Browse Our Products
                  </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
