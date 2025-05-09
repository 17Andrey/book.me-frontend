import React from 'react';
import { useState, useRef, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import Header from '../components/Header';
import BookingPopup from '../components/BookingPopup';
import UserPopup from '../components/UserPopup';
import { useAuth } from '../contexts/AuthContext';

import rest1 from '../assets/img/rest1.jpg';
import rest2 from '../assets/img/rest2.jpg';
import rest3 from '../assets/img/rest3.jpg';
import rest4 from '../assets/img/rest4.jpg';
import rest5 from '../assets/img/rest5.jpg';
import rest6 from '../assets/img/rest6.jpg';
import restaurantInterior from '../assets/img/restaurant-interior.jpg';
import { getRestaurants } from '../api/restaurants';

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

const Home = () => {
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const restaurantsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const { isAuthenticated } = useAuth();
  const [showUserPopup, setShowUserPopup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!restaurantsRef.current || !heroRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      setShowHeader(heroBottom <= 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getRestaurants(page).then((data) => {
      setRestaurants(data.data);
      setMaxPage(data.totalPages);
    });
  }, [page]);

  const handlePageChange = (value: number) => {
    getRestaurants(value).then((data) => {
      setRestaurants(data.data);
    });
    setPage(value);
  };

  const scrollToRestaurants = () => {
    restaurantsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    if (!isAuthenticated) {
      setShowUserPopup(true);
    } else {
      setSelectedRestaurant(restaurant);
    }
  };

  return (
    <div>
      {showHeader && (
        <header className="fixed top-0 left-0 w-full z-30">
          <Header onLogoClick={scrollToHero} onProfileClick={() => {}} />
        </header>
      )}
     
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-[400px]">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="flex justify-center items-stretch">
                <RestaurantCard 
                  restaurant={restaurant} 
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              </div>
            ))}
          </div>
          {/* Пагинация */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: maxPage }, (_, index) => index + 1).map((num) => (
              <button
                key={num}
                className={`w-9 h-9 rounded-full border text-lg font-medium transition cursor-pointer ${
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
        restaurantId={selectedRestaurant?.id||0}      />
      <UserPopup
        open={showUserPopup}
        onClose={() => setShowUserPopup(false)}
      />
    </div>
  );
};

export default Home;