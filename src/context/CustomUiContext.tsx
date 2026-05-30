import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface AlertOptions {
  title?: string;
  message: string;
  type?: ToastType;
  buttonText?: string;
}

interface CustomUiContextType {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (opt: ConfirmOptions) => void;
  showAlert: (opt: AlertOptions) => void;
}

const CustomUiContext = createContext<CustomUiContextType | undefined>(undefined);

export function CustomUiProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmOptions | null>(null);
  const [alertModal, setAlertModal] = useState<AlertOptions | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto dismiss
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const showConfirm = (opt: ConfirmOptions) => {
    setConfirmModal(opt);
  };

  const showAlert = (opt: AlertOptions) => {
    setAlertModal(opt);
  };

  const closeConfirm = (confirmed: boolean) => {
    if (confirmModal) {
      if (confirmed) {
        confirmModal.onConfirm();
      } else if (confirmModal.onCancel) {
        confirmModal.onCancel();
      }
    }
    setConfirmModal(null);
  };

  return (
    <CustomUiContext.Provider value={{ showToast, showConfirm, showAlert }}>
      {children}

      {/* --- PREMIUM TOAST CONTAINER --- */}
      <div className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => {
            let Icon = CheckCircle2;
            let themeClass = 'bg-[#111111] text-[#FFFDF8] border-[#D6B46A]/25';
            let iconColor = 'text-[#D6B46A]';

            if (toast.type === 'error') {
              Icon = XCircle;
              themeClass = 'bg-[#111111] text-[#FFFDF8] border-rose-500/30';
              iconColor = 'text-rose-500';
            } else if (toast.type === 'warning') {
              Icon = AlertTriangle;
              themeClass = 'bg-[#111111] text-[#FFFDF8] border-amber-500/30';
              iconColor = 'text-amber-500';
            } else if (toast.type === 'info') {
              Icon = Info;
              themeClass = 'bg-[#FFFDF8] text-[#111111] border-[#D6B46A]/25';
              iconColor = 'text-[#BFA15A]';
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl border-2 shadow-xl ${themeClass}`}
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
                <div className="flex-1 text-xs font-semibold leading-relaxed">
                  {toast.message}
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* --- PREMIUM CONFIRM DIALOG MODAL --- */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              onClick={() => closeConfirm(false)}
              className="absolute inset-0 bg-[#000000]"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#FFFDF8] border-2 border-[#D6B46A]/35 rounded-2xl shadow-2xl overflow-hidden p-6 text-left space-y-5"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
                  SamaXon Command Terminal
                </span>
                <h3 className="font-display text-base font-black text-[#111111] uppercase tracking-wider">
                  {confirmModal.title || 'Execute Request?'}
                </h3>
                <p className="text-xs text-[#8A8178] leading-relaxed font-semibold">
                  {confirmModal.message}
                </p>
              </div>

              <div className="flex justify-end gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => closeConfirm(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer text-center min-w-[100px]"
                >
                  {confirmModal.cancelText || 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => closeConfirm(true)}
                  className="px-4 py-2 bg-[#111111] text-[#D6B46A] hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer text-center min-w-[100px]"
                >
                  {confirmModal.confirmText || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PREMIUM ALERT MODAL --- */}
      <AnimatePresence>
        {alertModal && (
          <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              onClick={() => setAlertModal(null)}
              className="absolute inset-0 bg-[#000000]"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#FFFDF8] border-2 border-[#D6B46A]/35 rounded-2xl shadow-2xl overflow-hidden p-6 text-left space-y-5"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {alertModal.type === 'error' ? (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  ) : alertModal.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-[#D6B46A] shrink-0" />
                  )}
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
                    System Alert Notification
                  </span>
                </div>
                <h3 className="font-display text-base font-black text-[#111111] uppercase tracking-wider">
                  {alertModal.title || 'Notice Info'}
                </h3>
                <p className="text-xs text-[#8A8178] leading-relaxed font-semibold">
                  {alertModal.message}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setAlertModal(null)}
                  className="px-5 py-2.5 bg-[#111111] text-[#D6B46A] hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer min-w-[100px] text-center"
                >
                  {alertModal.buttonText || 'Understood'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CustomUiContext.Provider>
  );
}

export function useCustomUi() {
  const context = useContext(CustomUiContext);
  if (!context) {
    throw new Error('useCustomUi must be used within a CustomUiProvider');
  }
  return context;
}
