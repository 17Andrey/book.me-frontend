import React from 'react';
import { useState } from 'react';
import { PersonIcon } from '@radix-ui/react-icons';
import { useAuth } from '../contexts/AuthContext';
import UserPopup from './UserPopup';
import { getBookings } from '../api/booking';
import BookingList from './BookingList';

interface HeaderProps {
  onLogoClick: () => void;
  onProfileClick: () => void;
}

const Header = ({ onLogoClick }: HeaderProps) => {
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showBookingList, setShowBookingList] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowUserPopup(true);
    } else {
      setShowBookingList(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur border-b border-blue-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <button
            onClick={onLogoClick}
            className="text-xl font-bold tracking-wide text-blue-900 hover:text-blue-700 transition-colors font-sans"
          >
            Book.me
          </button>
          <button
            onClick={handleProfileClick}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-100 transition"
            aria-label="Профиль"
          >
            <PersonIcon width={24} height={24} />
          </button>
        </div>
      </header>

      <UserPopup 
        open={showUserPopup} 
        onClose={() => setShowUserPopup(false)} 
      />
      <BookingList
        open={showBookingList}
        onClose={() => setShowBookingList(false)}
      />
    </>
  );
};

export default Header;