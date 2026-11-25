import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#180D20]/65 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog Card */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} my-8 rounded-3xl bg-[#FFFFFF] border border-[#24152F]/12 shadow-2xl shadow-[#180D20]/30 p-6 sm:p-8 z-10 overflow-hidden text-[#24152F]`}
        onClick={e => e.stopPropagation()}
      >
        {/* Prismatic Top Gradient Edge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#3548D4] via-[#A66CFF] via-[#FF784F] to-[#D6EF72]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#A66CFF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#24152F]/8 mb-5">
          <div>
            <h3 className="text-xl font-bold text-[#24152F] font-heading">{title}</h3>
            {subtitle && (
              <p className="text-xs text-[#6C5A7A] mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#9887A4] hover:text-[#24152F] hover:bg-[#F6F0E6] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};
