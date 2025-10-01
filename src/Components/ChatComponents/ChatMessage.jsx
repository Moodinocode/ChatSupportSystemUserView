import React, { useEffect, useState } from 'react';
import { getQuickReplyContent } from '../../Services/twilioService';

const ChatMessage = ({ 
  message, 
  isCurrentUser, 
  author, 
  profileImageUrl, 
  timestamp,
  media,
    mediaUrl, // Add this prop
  loadingMedia, // Add this prop
  content,
}) => {
  const [isQuickReply,setIsQuickReply] = useState(false)
  const [quickReplyData,setQuickReplyData] = useState()

  useEffect(() => {
    console.log(content)
    if (content !=null){
      setIsQuickReply(true);
       const qr = getQuickReplyContent();
       console.log(qr)
       setQuickReplyData(qr)


    }
  },[content])
    // At the top of ChatMessage component, before the return statement
  if (content?.type?.startsWith('twilio/participant') || 
      content?.type?.startsWith('twilio/conversation') ||
      content?.type?.startsWith('twilio/topic')) {
    return (
      <SystemMessage 
        type={content.type}
        author={author}
        variables={content.variables}
        timestamp={timestamp}
      />
    );
}


   // Function to render media content
  const renderMedia = () => {
    if (!media) return null;

    // If we have mediaUrl (from temporary URL), use it
    const imageUrl = mediaUrl || (media && media.url);
    
    if (loadingMedia) {
      return (
        <div className="flex items-center justify-center p-4 bg-base-200 rounded max-w-xs">
          <div className="loading loading-spinner loading-sm mr-2"></div>
          <span className="text-sm">Loading media...</span>
        </div>
      );
    }

    if (!imageUrl) {
      return (
        <div className="flex items-center justify-center p-4 bg-base-200 rounded max-w-xs">
          <span className="text-sm">Media content unavailable</span>
        </div>
      );
    }

    if (media.contentType?.startsWith("image/")) {
      return (
        <img 
          src={imageUrl} 
          alt="sent media" 
          className="max-w-xs rounded" 
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            e.target.style.display = 'none';
          }}
        />
      );
    } else if (media.contentType?.startsWith("video/")) {
      return (
        <video controls className="max-w-xs rounded">
          <source src={imageUrl} type={media.contentType} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <a href={imageUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">
          {media.filename || 'Download file'}
        </a>
      );
    }
  };

  return (
    <div className={`chat ${isCurrentUser ? 'chat-end' : 'chat-start'}`}>
      {/* Avatar */}
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt={`${author} avatar`}
            src={profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random`}
          />
        </div>
      </div>

      {/* Header */}
      <div className="chat-header">
        {author}
        <time className="text-xs opacity-50 ml-2">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>

      {/* Message Bubble */}
      <div className="chat-bubble">
        {isQuickReply && quickReplyData ? (
          <div>
    <p>
    {
      quickReplyData.types["twilio/quick-reply"].body.replace(
        "{{1}}",
        quickReplyData.variables?.["1"] || author
      )
    }
  </p>

          <div className="flex gap-2 mt-2">
              {quickReplyData.types["twilio/quick-reply"].actions.map((action) => (
                <button
                  key={action.id}
                  className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600"
                  onClick={() => console.log("Quick reply clicked:", action.id)}
                >
                  {action.title}
                </button>
              ))}
            </div>
          </div>

        ) : media ? renderMedia(): (
          message
        )}
      </div>

      {/* Footer */}
      <div className="chat-footer opacity-50">
        {isCurrentUser ? 'Delivered' : ''}
      </div>
    </div>
  );
};

export default ChatMessage;
