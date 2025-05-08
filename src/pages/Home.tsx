import React from 'react';
import { useState, useRef, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import Header from '../components/Header';
import BookingPopup from '../components/BookingPopup';

import rest1 from '../assets/img/rest1.jpg';
import rest2 from '../assets/img/rest2.jpg';
import rest3 from '../assets/img/rest3.jpg';
import rest4 from '../assets/img/rest4.jpg';
import rest5 from '../assets/img/rest5.jpg';
import rest6 from '../assets/img/rest6.jpg';
import restaurantInterior from '../assets/img/restaurant-interior.jpg';
import { AnimatePresence, motion } from "framer-motion";

interface Restaurant {
  id: number;
  name: string;
  image: string;
  seats: number;
  address: string;
  cuisines: string[];
  price: number;
  metro?: string;
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: 'GRILL AND CHILL',
    image: rest1,
    seats: 12,
    address: 'ул. 8 Марта, д. 10',
    cuisines: ['Европейская'],
    price: 1,
    metro: 'Европейская',
  },
  {
    id: 2,
    name: 'PASHTET',
    image: rest2,
    seats: 14,
    address: 'ул. Толмачева, д. 23',
    cuisines: ['Европейская', 'Русская'],
    price: 2,
    metro: '',
  },
  {
    id: 3,
    name: 'КАК У ТЁЩИ',
    image: rest3,
    seats: 8,
    address: 'ул. Малышева, д. 17',
    cuisines: ['Европейская', 'Русская', 'Грузинская'],
    price: 3,
    metro: '',
  },
  {
    id: 4,
    name: 'CARBONARA',
    image: rest4,
    seats: 10,
    address: 'просп. Ленина, 25',
    cuisines: ['Итальянская'],
    price: 2,
    metro: '',
  },
  {
    id: 5,
    name: 'GARGULIA',
    image: rest5,
    seats: 16,
    address: 'ул. Энгельса, д. 7',
    cuisines: ['Французская', 'Европейская'],
    price: 1,
    metro: '',
  },
  {
    id: 6,
    name: 'Claude Monet',
    image: rest6,
    seats: 14,
    address: 'ул. Розы Люксембург, д. 49',
    cuisines: ['Французская'],
    price: 3,
    metro: '',
  },
];

  // const buttonStyle =
  //   'bg-black/10 text-white border border-white/20 rounded-lg text-lg px-8 py-3 font-normal cursor-pointer shadow transition hover:bg-black/70';

const Home = () => {
  const [page, setPage] = useState(1);
  const restaurantsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!restaurantsRef.current || !heroRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      setShowHeader(heroBottom <= 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  const scrollToRestaurants = () => {
    restaurantsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <div>
      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full z-30"
          >
            <Header onLogoClick={scrollToHero} onProfileClick={() => {}} />
          </motion.header>
        )}
      </AnimatePresence>
     
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="h-screen flex items-center justify-center relative bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurantInterior})` }}
      >
        <div className="relative text-center text-white bg-black/30 rounded-2xl px-4 md:px-16 py-8 max-w-3xl mx-auto flex flex-col items-center justify-center">
          <span className="text-lg font-normal mb-2 tracking-wide">ЛУЧШИЕ РЕСТОРАНЫ ЕКАТЕРИНБУРГА</span>
          <span className="text-4xl md:text-6xl font-normal mb-6 leading-tight text-nowrap">ВЫБЕРИ И ЗАБРОНИРУЙ</span>
          <button
            onClick={scrollToRestaurants}
            className="bg-black/30 text-white border border-white/20 rounded-lg text-lg px-8 py-3 font-normal cursor-pointer shadow transition hover:bg-black/70"
            onMouseOver={() => setIsHover(true)}
            onMouseOut={() => setIsHover(false)}
            style={{
              background: isHover ? 'rgba(30,30,30,0.7)' : undefined,
            }}
          >
            Выбрать ресторан
          </button>
        </div>
      </div>

      {/* Restaurants Grid Section */}
      <div
        ref={restaurantsRef}
        className="min-h-screen flex flex-col justify-center bg-white rounded-2xl px-2 md:px-8 py-16 shadow-lg"
      >
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-8 text-neutral-900 font-sans">Рестораны Екатеринбурга</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="flex justify-center items-stretch">
                <RestaurantCard 
                  restaurant={restaurant} 
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              </div>
            ))}
          </div>
          {/* Пагинация (пример без MUI) */}
          <div className="flex justify-center mt-8 gap-2">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`w-9 h-9 rounded-full border text-lg font-medium transition ${
                  page === num
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BookingPopup 
        open={!!selectedRestaurant} 
        onClose={() => setSelectedRestaurant(null)} 
      />
    </div>
  );
};

export default Home;