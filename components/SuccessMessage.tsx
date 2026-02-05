'use client';

import React, { useEffect, useState } from 'react';

interface SuccessMessageProps {
  show: boolean;
  onDismiss: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ show, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onDismiss();
        }, 300); // Wait for fade-out animation
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg px-8 py-6 max-w-2xl">
        <p className="text-gray-800 text-center">
          Thank you. Your purchase is now being processed.
        </p>
        <p className="text-gray-800 text-center mt-2">
          We will be in touch with you soon!
        </p>
      </div>
    </div>
  );
};

export default SuccessMessage;
