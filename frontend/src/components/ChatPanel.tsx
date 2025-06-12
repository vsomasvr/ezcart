
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import ChatMessageBubble from './ChatMessageBubble';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (messageText: string) => void;
  currentUser: string | null; // To display user avatar or name
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose, messages, onSendMessage, currentUser }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-slate-800 shadow-2xl border-l border-slate-700
                  transform transition-transform duration-300 ease-in-out
                  w-full sm:w-96 md:w-[400px] flex flex-col z-50
                  ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      role="log"
      aria-live="polite"
      aria-atomic="false" // New messages will be appended
    >
      {/* Header */}
      <header className="bg-slate-900 p-4 flex items-center justify-between border-b border-slate-700">
        <h3 className="text-lg font-semibold text-sky-400">
          <i className="fas fa-robot mr-2 text-cyan-400"></i>AI Assistant
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-sky-300 transition-colors"
          aria-label="Close chat panel"
        >
          <i className="fas fa-times text-2xl"></i>
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-800/50">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} currentUser={currentUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="pt-3 pl-3 pr-6 pb-20 border-t border-slate-700 bg-slate-900">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
            aria-label="Chat message input"
          />
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold w-12 h-12 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 flex items-center justify-center"
            aria-label="Send message"
          >
            <i className="fas fa-paper-plane text-xl"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;