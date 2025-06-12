
import React from 'react';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  currentUser: string | null; // For potential avatar display
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, currentUser }) => {
  const isUser = message.sender === 'user';
  const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Basic avatar from username initials
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.substring(0, 1).toUpperCase();
  };
  
  const userAvatarInitial = getInitials(currentUser);
  const aiAvatarInitial = 'AI';


  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold shadow-md">
          {aiAvatarInitial}
        </div>
      )}
      <div
        className={`max-w-[70%] sm:max-w-[65%] p-3 rounded-xl shadow-md ${
          isUser
            ? 'bg-sky-600 text-white rounded-br-none'
            : 'bg-slate-600 text-slate-100 rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <p
          className={`text-xs mt-1.5 ${
            isUser ? 'text-sky-200 text-right' : 'text-slate-400 text-left'
          }`}
        >
          {time}
        </p>
      </div>
      {isUser && (
         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-semibold shadow-md">
          {userAvatarInitial}
        </div>
      )}
    </div>
  );
};

export default ChatMessageBubble;
