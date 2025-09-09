import React from 'react';

const ChatMessage = ({ 
  message, 
  isCurrentUser, 
  author, 
  profileImageUrl, 
  timestamp 
}) => {
  return (
    <div className={`chat ${isCurrentUser ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt={`${author} avatar`}
            src={profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random`}
          />
        </div>
      </div>
      <div className="chat-header">
        {author}
        <time className="text-xs opacity-50 ml-2">
          {timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </time>
      </div>
      <div className="chat-bubble">
        {message}
      </div>
      <div className="chat-footer opacity-50">
        {isCurrentUser ? 'Delivered' : ''}
      </div>
    </div>
  );
};

export default ChatMessage;