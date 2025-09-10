import React, { useEffect, useState } from 'react';
import  useConversationStore  from '../../Stores/useConversationStore';

const ConversationSidebar = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    leaveConversation,
    loading,
  } = useConversationStore();
  
  // Sidebar toggle
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    setTimeout(() => {}, 1000); 
    console.log(conversations);
  }, [conversations]);







  const filteredConversations = Array.from(conversations)
    .filter(convData => 
      (convData.conversation.friendlyName || 'Unnamed').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.lastActivity - a.lastActivity);

  return (
    <div className="flex h-full">
      {/* Toggle button when sidebar is closed */}
      {!showSidebar && (
        <button 
          onClick={() => setShowSidebar(true)}
          className="btn btn-ghost btn-sm h-fit mt-4 ml-2"
        >
          →
        </button>
      )}
      
      <div className={`flex flex-col h-full border-r transition-all duration-300 ${showSidebar ? 'w-80' : 'w-0'} overflow-hidden`}>
        {showSidebar && (
          <div className="bg-success-content-100 flex flex-col h-full">
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Tickets</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowSidebar(false)}
                    className="btn btn-ghost btn-sm"
                  >
                    ←
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div>
                <input
                  type="text"
                  placeholder="Search Tickets"
                  className="input input-bordered input-sm w-full text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
          </div>

            {/* Conversation List - with proper scrolling */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex justify-center items-center h-full p-4">
               </div>
              )}
              {filteredConversations.map((convData) => (
                <div 
                  key={convData.sid}
                  className={`p-3 border-b cursor-pointer hover:bg-base-200 ${
                    activeConversation?.conversation.sid === convData.conversation.sid ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => setActiveConversation(convData)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate text-sm">
                          {convData.conversation.friendlyName || 'Unnamed'}
                        </h3>
                        {convData.unreadCount > 0 && (
                          <span className="badge badge-primary badge-xs">
                            {convData.unreadCount}
                          </span>
                        )}
                      </div>
                      {/* <p className="text-xs text-base-content/60 truncate">
                        {getLastMessagePreview(convData.messages)}
                      </p> */}
                      <p className="text-xs text-base-content/40 mt-1">
                        {convData.participants.length} participants
                      </p>
                    </div>
                    <div className="dropdown dropdown-end">
                      <button 
                        tabIndex={0} 
                        className="btn btn-ghost btn-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ⋮
                      </button>
                      <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-32">
                        <li>
                          <a onClick={() => leaveConversation(convData.conversation.sid)}>
                            Leave
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
              
              {conversations.size === 0 && (
                <div className="p-4 text-center text-base-content/50">
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Join or create one to get started</p>
                </div>
              )}

              {conversations.size > 0 && filteredConversations.length === 0 && (
                <div className="p-4 text-center text-base-content/50">
                  <p className="text-sm">No conversations found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConversationSidebar