import React, { useEffect, useState } from 'react';
import { Cross2Icon, TrashIcon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { getBookings, deleteBookings } from '../api/booking';
import { useAuth } from '../contexts/AuthContext';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface BookingListProps {
  open: boolean;
  onClose: () => void;
}

interface Booking {
  id: number;
  userId: number;
  restaurantId: number;
  date: string;
  time: string;
  guests: number;
  restaurant: {
    id: number;
    name: string;
    address: string;
  };
}

const BookingList: React.FC<BookingListProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (open && user) {
      setLoading(true);
      getBookings(String(user.id))
        .then((data) => setBookings(data))
        .finally(() => setLoading(false));
    }
  }, [open, user]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await deleteBookings(String(id));
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setDeletingId(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 z-[101]"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                onClick={onClose}
                aria-label="Закрыть"
              >
                <Cross2Icon width={24} height={24} />
              </motion.button>
              <h2 className="text-2xl font-medium mb-6 text-center">Мои бронирования</h2>
              {loading ? (
                <div className="text-center py-8">Загрузка...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Нет активных бронирований</div>
              ) : (
                <ul className="space-y-4">
                  {bookings.map((b) => (
                    <li key={b.id} className="rounded-xl border border-gray-200 bg-white shadow flex flex-row items-center justify-between p-4 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-lg text-blue-900">{b.restaurant?.name || 'Ресторан'}</span>
                        <span className="text-sm text-gray-600">{b.restaurant?.address}</span>
                        <span className="text-sm text-gray-700">Дата: {new Date(b.date).toLocaleDateString()}</span>
                        <span className="text-sm text-gray-700">Время: {b.time}</span>
                        <span className="text-sm text-gray-700">Гостей: {b.guests}</span>
                      </div>
                      <AlertDialog.Root>
                        <AlertDialog.Trigger asChild>
                          <button
                            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                            aria-label="Удалить бронирование"
                            disabled={deletingId === b.id}
                          >
                            <TrashIcon width={22} height={22} />
                          </button>
                        </AlertDialog.Trigger>
                        <AlertDialog.Portal>
                          <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-[110]" />
                          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg max-w-md w-full z-[111]">
                            <AlertDialog.Title className="text-lg font-medium mb-2">Удалить бронирование?</AlertDialog.Title>
                            <AlertDialog.Description className="text-gray-600 mb-4">
                              Вы уверены, что хотите удалить это бронирование? Это действие необратимо.
                            </AlertDialog.Description>
                            <div className="flex justify-end gap-2">
                              <AlertDialog.Cancel asChild>
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Отмена</button>
                              </AlertDialog.Cancel>
                              <AlertDialog.Action asChild>
                                <button
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
                                  onClick={() => handleDelete(b.id)}
                                  disabled={deletingId === b.id}
                                >
                                  Удалить
                                </button>
                              </AlertDialog.Action>
                            </div>
                          </AlertDialog.Content>
                        </AlertDialog.Portal>
                      </AlertDialog.Root>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingList;
