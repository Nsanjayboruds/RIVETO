import React, { useEffect, useState } from 'react';
import Background from '../components/Background';
import Hero from '../components/Hero';
import Product from './Product';
import OurPolicy from '../components/OurPolicy';
import NewLetterBox from '../components/NewLetterBox';
import Footer from '../components/Footer';
import gsap from 'gsap';
// import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';
// import CircularGallery from '../components/CircularGallery'

function Home() {
  const heroData = [
    { text1: "30% OFF LIMITED TIME OFFER", text2: "Style Your Home with Our Products" },
    { text1: "Discover the best of bold fashion", text2: "LIMITED TIME OFFER ONLY!" },
    { text1: "Explore our best collection", text2: "Shop Now and Save Big!" },
    { text1: "Choose your perfect Fashion", text2: "Now is the perfect time to shop!" }
  ];

  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount(prevCount => (prevCount === 3 ? 0 : prevCount + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ GSAP fade-in animation for sections
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    if (elements.length > 0) {
      gsap.from(elements, {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
      });
    }
  }, []);

  return (
    <div className='overflow-x-hidden'>
      {/* Hero Section */}
      <div className='relative w-screen h-screen overflow-hidden'>
        <Background heroCount={heroCount} />
        <Hero heroCount={heroCount} heroData={heroData[heroCount]} setHeroCount={setHeroCount} />
      </div>
        
    {/* <div style={{ height: '600px', position: 'relative' }}>

   <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/> 

</div> */}
       
      {/* Animated Product Section */}
      <div className="fade-in">
        
        <Product />
      </div>

      {/* Animated Policy Section */}
      <div className="fade-in">
        <OurPolicy />
      </div>

      {/* Animated Newsletter Section */}
      <div className="fade-in">
        <NewLetterBox />
      
      </div>
       

      {/* Animated Footer Section */}
      <div className="fade-in">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
