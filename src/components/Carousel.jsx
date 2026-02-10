import React, { useState, useEffect } from "react";
import "./Carousel.css";

const logos = [
  "/logos/logo1.png",
  "/logos/logo2.png",
  "/logos/logo3.png",
  "/logos/logo4.png",
  "/logos/logo5.png",
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === logos.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? logos.length - 1 : prevIndex - 1,
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === logos.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="carousel-container">
      <button className="arrow left" onClick={prevSlide}>
        &#10094;
      </button>

      <div className="carousel-slide">
        <img src={logos[currentIndex]} alt={`Logo ${currentIndex + 1}`} />
      </div>

      <button className="arrow right" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
}
