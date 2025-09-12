import React from 'react';

const ChatMessage = ({ 
  message, 
  isCurrentUser, 
  author, 
  profileImageUrl, 
  timestamp,
  media 
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
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>

      <div className="chat-bubble">
        {media ? (
          media.contentType.startsWith("image/") ? (
            <img 
              src={media.url} 
              alt="sent media" 
              className="max-w-xs rounded" 
            />
          ) : media.contentType.startsWith("video/") ? (
            <video controls className="max-w-xs rounded">
              <source src={media.url} type={media.contentType} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <a href={media.url} target="_blank" rel="noreferrer" className="text-blue-500 underline">
              Download file
            </a>
          )
        ) : (
          message
        )}
      </div>

      <div className="chat-footer opacity-50">
        {isCurrentUser ? 'Delivered' : ''}
      </div>
    </div>
  );
};

export default ChatMessage;
