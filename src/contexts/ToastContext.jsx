import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/ui/Toast';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', message, duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => addToast({ type: 'success', message, duration }), [addToast]);
  const error = useCallback((message, duration) => addToast({ type: 'error', message, duration }), [addToast]);
  const warning = useCallback((message, duration) => addToast({ type: 'warning', message, duration }), [addToast]);
  const info = useCallback((message, duration) => addToast({ type: 'info', message, duration }), [addToast]);

  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    toasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
