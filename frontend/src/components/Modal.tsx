'use client';

import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  showCancel = false,
}: ModalProps) {
  if (!isOpen) return null;

  const icons = {
    info: <Info size={24} className="text-primary" />,
    success: <CheckCircle size={24} className="text-green-500" />,
    error: <AlertCircle size={24} className="text-red-500" />,
    warning: <AlertCircle size={24} className="text-yellow-500" />,
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-dark-bg border border-gray-800 rounded-lg p-6 max-w-md w-full mx-4 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icons[type]}
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-300 mb-6 whitespace-pre-line">{message}</p>

        <div className="flex justify-end space-x-2">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-dark-bg hover:bg-gray-800 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-primary hover:bg-purple-600 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

