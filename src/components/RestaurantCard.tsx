import { useState } from 'react';
import { HatIcon } from '../assets/hatIcon';
import { GlobeIcon } from '@radix-ui/react-icons';

interface Restaurant {
  id: number;
  name: string;
  image: string;
  seats: number;
  address: string;
  cuisines: string[];
  price: number; // 1, 2, 3
  metro?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      className={`w-[375px] h-[300px] rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-100 cursor-pointer bg-white ${isActive ? 'scale-95' : 'scale-100'} select-none`}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      onClick={onClick}
    >
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-[160px] object-cover"
      />
      <div className="flex flex-col flex-1 px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span
            className="uppercase tracking-wide text-[20px] leading-tight font-sans text-black"
            style={{ fontFamily: 'Instrument Sans, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}
          >
            {restaurant.name}
          </span>
          <span>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="text-[22px] ml-0.5 font-light"
                style={{ color: '#222', opacity: i < restaurant.price ? 1 : 0.5, letterSpacing: 1 }}
              >
                ₽
              </span>
            ))}
          </span>
        </div>
        <span className="text-[15px] text-neutral-500 mb-0.5">{restaurant.seats} посадочных мест</span>
        <div className="flex items-center gap-2 mb-0.5">
          <GlobeIcon className="w-4 h-4" />
          <span className="text-[15px] text-neutral-500">{restaurant.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <HatIcon className="w-4 h-4" />
          <span className="text-[15px] text-neutral-500">{(restaurant.cuisines || []).join(', ')}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard; 