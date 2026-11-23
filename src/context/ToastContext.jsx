import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const recentMessagesRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', message, duration = 4000 }) => {
      if (!message) return;

      const now = Date.now();
      const lastSeen = recentMessagesRef.current.get(message);

      // Deduplicate: Ignore identical toast message if emitted within 2.5 seconds
      if (lastSeen && now - lastSeen < 2500) {
        return;
      }
      recentMessagesRef.current.set(message, now);

      // Clean up stale cache keys periodically
      if (recentMessagesRef.current.size > 20) {
        for (const [msg, time] of recentMessagesRef.current.entries()) {
          if (now - time > 5000) recentMessagesRef.current.delete(msg);
        }
      }

      const id = Date.now() + Math.random().toString(36).substring(2, 9);

      // Limit to at most 3 toasts on screen simultaneously to prevent stacking
      setToasts((prev) => {
        const next = [...prev.slice(-2), { id, type, message }];
        return next;
      });

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  // Memoize toast methods so their reference NEVER changes between renders!
  const toast = useMemo(
    () => ({
      success: (msg, duration) => addToast({ type: 'success', message: msg, duration }),
      error: (msg, duration) => addToast({ type: 'error', message: msg, duration }),
      info: (msg, duration) => addToast({ type: 'info', message: msg, duration }),
      warning: (msg, duration) => addToast({ type: 'warning', message: msg, duration })
    }),
    [addToast]
  );

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50 text-emerald-900';
      case 'error':
        return 'border-rose-200 bg-rose-50 text-rose-900';
      case 'warning':
        return 'border-amber-200 bg-amber-50 text-amber-900';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-900';
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in slide-in-from-right duration-200 ${getBorderColor(
              t.type
            )}`}
          >
            {getIcon(t.type)}
            <div className="flex-1 text-sm font-medium leading-relaxed">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors -mr-1 -mt-1 p-1 rounded-lg cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
