
import React from 'react';

interface ChatToggleButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick, isOpen }) => {
  const baseClasses = "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50 z-[60]";
  
  const openButtonClasses = "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white hover:scale-110 focus:ring-sky-400";
  const closeButtonClasses = "bg-slate-600 text-slate-200 opacity-60 hover:opacity-100 hover:bg-slate-500 focus:opacity-100 focus:ring-slate-400";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isOpen ? closeButtonClasses : openButtonClasses}`}
      aria-label={isOpen ? "Close chat panel" : "Open chat panel"}
      title={isOpen ? "Close Chat" : "Open Chat"}
    >
      {isOpen ? (
        <i className="fas fa-times text-2xl"></i>
      ) : (
        <i className="fas fa-comments text-2xl"></i>
      )}
    </button>
  );
};

export default ChatToggleButton;
