import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Trash2, RotateCcw, AlertCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="w-6 h-6 text-rose-600" />;
      case 'restore':
        return <RotateCcw className="w-6 h-6 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-blue-600" />;
    }
  };

  const getButtonBg = () => {
    switch (type) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white';
      case 'restore':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-100 rounded-xl shrink-0">{getIcon()}</div>
        <div className="text-sm text-slate-600 leading-relaxed">{message}</div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 ${getButtonBg()} disabled:opacity-50`}
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};
