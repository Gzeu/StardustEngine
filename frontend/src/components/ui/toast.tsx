'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const toastVariants = {
  hidden: {
    opacity: 0,
    x: 300,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: 300,
    scale: 0.9,
  },
};

const Toast = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & ToastProps
>(({ id, title, description, type = 'info', duration = 4000, onClose, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 150);
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          className: 'border-green-500/20 bg-green-500/10 text-green-400',
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          className: 'border-red-500/20 bg-red-500/10 text-red-400',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          className: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
        };
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          className: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
        };
    }
  };

  const config = getTypeConfig();

  if (!isVisible) return null;

  return (
    <motion.div
      ref={ref}
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`
        relative flex w-full max-w-sm items-start space-x-3 rounded-lg border p-4 pr-8 shadow-lg backdrop-blur-xl
        ${config.className}
      `}
      {...props}
    >
      <div className="flex-shrink-0">
        {config.icon}
      </div>
      <div className="flex-1 space-y-1">
        {title && (
          <h4 className="text-sm font-semibold text-white">{title}</h4>
        )}
        {description && (
          <p className="text-sm text-gray-300">{description}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
});

Toast.displayName = 'Toast';

interface ToasterProps {
  toasts?: ToastProps[];
}

const ToasterContext = React.createContext<{
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
}>({} as any);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToasterContext.Provider>
  );
}

export function Toaster() {
  const { toasts, removeToast } = React.useContext(ToasterContext);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToasterContext);
  if (!context) {
    throw new Error('useToast must be used within a ToasterProvider');
  }
  return context;
}

export { Toast };