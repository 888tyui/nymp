import { useState } from 'react';

interface ModalConfig {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig>({
    message: '',
  });

  const showModal = (modalConfig: ModalConfig) => {
    setConfig(modalConfig);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    config,
    showModal,
    hideModal,
  };
}

