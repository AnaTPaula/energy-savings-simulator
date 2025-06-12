import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  isError?: boolean;
}

export function Modal({ isOpen, onClose, children, title, isError }: ModalProps) {
  if (!isOpen) return null;

  const modalClasses = isError ? "bg-red-50 border-red-300" : "bg-white";
  const titleClasses = isError ? "text-red-800" : "text-gray-800";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className={`rounded-xl p-6 max-w-md w-full mx-4 relative shadow-2xl transform transition-all animate-scaleIn ${modalClasses}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className={`text-2xl font-bold mb-6 border-b pb-3 ${titleClasses}`}>{title}</h2>
        {children}
      </div>
    </div>
  );
} 