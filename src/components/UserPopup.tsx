import React from 'react';
import { useState, useEffect } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { loginApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

interface UserPopupProps {
  open: boolean;
  onClose: () => void;
}

interface FormErrors {
  firstName?: string;
  phone?: string;
}


const UserPopup = ({ open, onClose }: UserPopupProps) => {
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const resetForm = () => {
    setFirstName('');
    setPhone('');
    setErrors({});
    setShowError(false);
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!firstName || firstName.length < 2) {
      newErrors.firstName = 'Имя должно содержать минимум 2 символа';
    }

    if (!phone || phone.length !== 11) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      loginApi(phone, firstName).then((response) => {console.log(response); login(response.access_token, response.user)}).catch((error) => {console.log(error)});
      resetForm();
      onClose();
    } else {
      setErrorMessage('Пожалуйста, исправьте ошибки в форме');
      setShowError(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ-]/g, '');
    setFirstName(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    setPhone(value);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
              onClick={handleClose}
            />
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                type: "spring",
                duration: 0.5,
                bounce: 0.2
              }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 z-[101]"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 relative">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                  onClick={handleClose}
                  aria-label="Закрыть"
                >
                  <Cross2Icon width={24} height={24} />
                </motion.button>
                <h2 className="text-2xl font-medium mb-6 text-center">Введите ваши данные</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Имя</span>
                    <input
                      type="text"
                      placeholder="Имя"
                      className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400`}
                      value={firstName}
                      onChange={handleNameChange}
                    />
                    {errors.firstName && <span className="text-sm text-red-500">{errors.firstName}</span>}
                  </label>
                  
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Телефон</span>
                    <input
                      type="text"
                      placeholder="89999999999"
                      className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400`}
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength={11}
                    />
                    {errors.phone && <span className="text-sm text-red-500">{errors.phone}</span>}
                  </label>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="mt-4 w-full bg-blue-100 text-blue-700 font-medium rounded-lg py-2 transition hover:bg-blue-200"
                  >
                    Войти
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AlertDialog.Root open={showError} onOpenChange={setShowError}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <AlertDialog.Title className="text-lg font-medium mb-2">
              Ошибка
            </AlertDialog.Title>
            <AlertDialog.Description className="text-gray-600 mb-4">
              {errorMessage}
            </AlertDialog.Description>
            <div className="flex justify-end">
              <AlertDialog.Cancel asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Понятно
                </motion.button>
              </AlertDialog.Cancel>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
};

export default UserPopup;