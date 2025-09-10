import React, { useState, useRef } from 'react';
import useConversationStore from "../../Stores/useConversationStore";
import { useAuth } from "../../Context/AuthContext";
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { initiateConversation } from '../../Services/ConversationService';

const CustomerServiceChatInterface = () => {
  const { initClient,activeConversation, sendMessage } = useConversationStore();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  
  const inactiveConversationMessageHandler = (message) => {
    // send API request to get Token and create a covnersation
    initiateConversation(message).then((response) => {
      console.log("Conversation initiated", response.data);
    }).catch((error) => {
      console.error("Error initiating conversation", error);
    });
    // then send the message
    
  }

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    if (activeConversation) {
      sendMessage(activeConversation.conversation.sid, newMessage);
    } else {
      inactiveConversationMessageHandler(newMessage); // Custom handler when no active conversation
    }

    setNewMessage("");
    scrollToBottom();
  };


  const isCurrentUserMessage = (message) => message.author === user?.username;

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
              isCurrentUser={isCurrentUserMessage(msg)}
              author={msg.author}
              profileImageUrl={getUserProfileImage(msg.author)}
              timestamp={msg.timestamp}
            />
          ))
        ) : (
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
        <div className="flex gap-2 items-end">
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
            disabled={!newMessage.trim()}
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
