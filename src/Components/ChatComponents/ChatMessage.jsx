import React, { useEffect, useState } from 'react';
import { getQuickReplyContent } from '../../Services/twilioService';

const ChatMessage = ({ 
  message, 
  isCurrentUser, 
  author, 
  profileImageUrl, 
  timestamp,
  media,
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

        ) : media ? (
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

      {/* Footer */}
      <div className="chat-footer opacity-50">
        {isCurrentUser ? 'Delivered' : ''}
      </div>
    </div>
  );
};

export default ChatMessage;
