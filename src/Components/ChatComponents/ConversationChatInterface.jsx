import React, { useState,useEffect, useRef } from 'react';
import useConversationStore from "../../Stores/useConversationStore";
import { Paperclip } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const CustomerServiceChatInterface = () => {
  const {activeConversation,inactiveConversationMessageSend, sendMessage,chatinitLoading } = useConversationStore();

  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
  if (activeConversation?.messages.length) {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [activeConversation?.messages.length]);

  const handleSend = () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage && !selectedFile) return; 

    if (activeConversation) {
      sendMessage(activeConversation.conversation.sid, {
        text: trimmedMessage || null,
        file: selectedFile || null,
      });
    } else {
      inactiveConversationMessageSend(trimmedMessage||null,selectedFile||null)
    }

    setNewMessage("");
    setSelectedFile(null);
  };



  const getUserProfileImage = (username) => {
    if (username === user?.username) return user?.profileImageUrl;
    return null; // No other participants to show
  };
  


  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-base-200 shadow-sm">
        <h3 className="font-semibold text-base text-base-content">Customer Support</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
        {activeConversation && activeConversation.messages.length > 0 ? (
          activeConversation.messages.map((msg) => (
            <ChatMessage
              key={msg.sid}
              message={msg.body}
              media={msg.media}
              mediaUrl={msg.mediaUrl} // Pass the temporary URL
              loadingMedia={msg.loadingMedia} // Pass loading state
              isCurrentUser={msg.author === user.username}
              author={msg.author}
              profileImageUrl={getUserProfileImage(msg.author)}
              timestamp={msg.timestamp}
              content={msg.contentSid}
            />
          ))
        ) : chatinitLoading? (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 bg-primary text-primary-content px-4 py-2 rounded-lg max-w-xs">
              <span className="loading loading-spinner loading-sm"></span>
              <span className="text-sm">Sending...</span>
            </div>
          </div>
        ):(
          <div className="flex items-center justify-center h-full">
            <p className="text-base-content/60 text-center">Send Message to Chat with Customer support</p>
          </div>
        )}





        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {activeConversation && (
        <TypingIndicator conversationSid={activeConversation.conversation.sid} />
      )}

      {/* Input */}
      <div className="border-t p-4 bg-base-200">
        {selectedFile && (
          <div className="p-2 text-sm text-gray-600">
            Selected file: {selectedFile.name}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-4 h-4" />
          </button>


          <div className="flex-1 relative">

            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="input input-bordered w-full pr-12 rounded-full"
              placeholder="Type a message..."
            />
          </div>
          <button
            onClick={handleSend}
            className="btn btn-primary btn-circle"
            disabled={!newMessage.trim()&&!selectedFile}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceChatInterface;
