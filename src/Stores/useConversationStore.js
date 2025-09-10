// src/store/useConversationStore.js
import { create } from "zustand";
import { Client } from "@twilio/conversations";
// import { getAllUsers } from "../Services/userService";
import {updateTypingIndicator}  from "../Utils/updateTypingIndicator";


const useConversationStore = create((set, get) => ({
  client: null,
  conversations: [], 
  activeConversation: null,
  loading: true,
  error: null,
  typingStatus: {},
 


  //since customer --> init on first message sent
  initClient: async () => {
    try {
      const token = sessionStorage.getItem("twilioToken");
      if (!token) throw new Error("Missing Twilio token in session storage");
    
      const client = new Client(token);


      client.on('initialized', () => {
        console.log("Twilio client initialized");
        //get().getConversations();
      });
      client.on("conversationLeft", (conv) => {
        // console.log("Left:", conv.sid);
        const { conversations } = get();
        set({
          conversations: conversations.filter(
            (c) => c.conversation.sid !== conv.sid
          ),
        });
      });

      client.on("conversationAdded", (conv) => {
        // console.log("Conversation added:", conv.sid);
        get().syncConversation(conv);
      });

      client.on("messageAdded", (msg) => {
        // console.log("Message added:", msg);
        get().appendMessage(msg);
      });


      client.on("participantJoined", (participant) => {
        // console.log("Participant joined:", participant.identity);

        // we can also decide to render the agentX joined conversation
        get().updateParticipants(participant.conversation.sid);
      });

      client.on("disconnected", () => {
        console.warn("Twilio client disconnected");
        set({ client: null, loading: false });
      });

      set({ client, loading: false });
      
      // Fetch initial conversations
      // await get().getConversations();
      return client;
      
    } catch (err) {
      console.error("Error initializing Twilio client:", err);
      set({ error: err.message, loading: false });
    }
  },
  setTypingStarted: (conversationSid, participant) => {
  const { typingStatus } = get();
  const updated = { ...typingStatus };

  if (!updated[conversationSid]) updated[conversationSid] = {};
  updated[conversationSid][participant.sid] = {
    identity: participant.identity,
    avatar: participant.attributes?.avatar || null, // assuming you store profile pics in attributes
    typing: true,
  };

  set({ typingStatus: updated });
},

setTypingEnded: (conversationSid, participant) => {
  const { typingStatus } = get();
  const updated = { ...typingStatus };

  if (updated[conversationSid] && updated[conversationSid][participant.sid]) {
    updated[conversationSid][participant.sid] = {
      ...updated[conversationSid][participant.sid],
      typing: false,
    };
  }

  set({ typingStatus: updated });
},

  // ----------- Sync Helpers ------------
  buildConversationData: async (conv) => {
    const participants = await conv.getParticipants();
    const messagesPaginator = await conv.getMessages(20); // last 20 messages
     console.log("Conversation data built:", conv);
    return {
      conversation: { sid: conv.sid, friendlyName: conv.friendlyName },
      unreadCount: await conv.getUnreadMessagesCount(),
      participants,
      lastActivity: messagesPaginator.items.length > 0
  ? messagesPaginator.items[messagesPaginator.items.length - 1].dateCreated.getTime()
  : 0, // or keep the previous lastActivity instead of defaulting to now

      messages: messagesPaginator.items.map((m) => ({
        sid: m.sid,
        author: m.author,
        body: m.body,
        timestamp: m.dateCreated,
      })),
    };
   

  },

  syncConversation: async (conv) => {
    const convData = await get().buildConversationData(conv);
    const { conversations } = get();

    // replace if exists, else push
    const exists = conversations.some(
      (c) => c.conversation.sid === conv.sid
    );
    let updated;
    if (exists) {
      updated = conversations.map((c) =>
        c.conversation.sid === conv.sid ? convData : c
      );
    } else {
      updated = [...conversations, convData];
    }

    set({ conversations: updated });
  },

    
  appendMessage: (msg) => {
    const { conversations, activeConversation } = get();
    
    const newMessage = {
      sid: msg.sid,
      author: msg.author,
      body: msg.body,
      timestamp: msg.dateCreated,
    };

    // Update conversations array
    const updated = conversations.map((c) => {
      if (c.conversation.sid === msg.conversation.sid) {
        // Check if message already exists to prevent duplicates
        const messageExists = c.messages.some(m => m.sid === msg.sid);
        if (messageExists) {
          return c; // Return unchanged if message already exists
        }
        
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastActivity: Date.now(),
           unreadCount: 
    activeConversation && activeConversation.conversation.sid === c.conversation.sid
      ? 0 // if it's the active conversation, unread stays 0
      : c.unreadCount + 1,
        };
      }
      return c;
    });

    // Update activeConversation if it's the same conversation
    let updatedActiveConversation = activeConversation;
    if (activeConversation && activeConversation.conversation.sid === msg.conversation.sid) {
      const messageExists = activeConversation.messages.some(m => m.sid === msg.sid);
      if (!messageExists) {
        updatedActiveConversation = {
          ...activeConversation,
          messages: [...activeConversation.messages, newMessage],
          lastActivity: Date.now(),
        };
      }
    }

    set({ 
      conversations: updated, 
      activeConversation: updatedActiveConversation
    });
  },

  updateParticipants: async (sid) => {
    const { conversations, client } = get();
    const conv = await client.getConversationBySid(sid);
    const participants = await conv.getParticipants();

    const updated = conversations.map((c) =>
      c.conversation.sid === sid ? { ...c, participants } : c
    );
    set({ conversations: updated });
  },

  getConversationBySid: async (sid) => {
    const { client } = get();
    console.log("Fetching conversation by SID:", sid);
    if (!client) {
      console.error("Twilio client not initialized yet");
      return null;
    }
    try {
    console.log("Twilio client exists, fetching conversation...");
    const conv = await client.getConversationBySid(sid);
    console.log("Fetched conversation:", conv);
    return conv;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return null;
    }
  },
  

  // ----------- Actions ------------
  getConversations: async () => {
    set({ loading: true, error: null });
    const { client } = get();
    if (!client) {
      console.error("Twilio client not initialized yet");
      set({ loading: false, error: "Client not initialized" });
      return;
    }
    try {
      const convs = await client.getSubscribedConversations();
      console.log("Fetched conversations:", convs);
      const conversations = await Promise.all(
        convs.items.map((conv) => get().buildConversationData(conv))
      );
      set({ conversations, loading: false });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      set({ error: error.message, loading: false });
    }


  },

setActiveConversation: async (active) => {
  try {
    const { client } = get(); 
    if (!client) {
      console.error("Twilio client not initialized yet");
      return;
    }
    console.log("Setting active conversation:", active.conversation);
    // Fetch the conversation
    const conversation = await client.getConversationBySid(active.conversation.sid);
console.log("Active conversation fetched:", conversation);

const builtconversation = await get().buildConversationData(conversation);

if (!builtconversation) {
  console.error("Active conversation not found:", active);
  return;
}
console.log("Active conversation set:", builtconversation);

builtconversation.unreadCount = 0;
set({ activeConversation: builtconversation });
set((state) => ({
  conversations: state.conversations.map((c) =>
    c.conversation.sid === builtconversation.conversation.sid
      ? { ...c, ...builtconversation, lastActivity: c.lastActivity }
      : c
  ),
}));

conversation.on('typingStarted', function(participant) {
  console.log("Typing started by:", participant.identity);
  updateTypingIndicator(participant, true);
});

conversation.on('typingEnded', function(participant) {
  updateTypingIndicator(participant, false);
});

  } catch (error) {
    console.error("Error fetching conversation:", error);
  }
},


getFirstConversationAndSetActive: async () => {
  try {
    const { client } = get();
    if (!client) {
      console.error("Twilio client not initialized yet");
      return null;
    }

    console.log("Getting first subscribed conversation...");
    
    const convs = await client.getSubscribedConversations();
    console.log("All subscribed conversations:", convs.items);
    
    if (convs.items.length === 0) {
      console.error("No subscribed conversations found");
      return null;
    }
    

    const twilioConv = convs.items[0];//assuming there is only 1 message
    console.log("Using first conversation:", twilioConv.sid);
    
    const conversation = await get().buildConversationData(twilioConv);
    
    if (!conversation) {
      console.error("Failed to build conversation data");
      return null;
    }


    console.log("Setting conversation as active:", conversation);
    

    conversation.unreadCount = 0;
    set({ activeConversation: conversation });
    
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.conversation.sid === conversation.conversation.sid
          ? { ...c, ...conversation, lastActivity: c.lastActivity } // keep old lastActivity
          : c
      ),
    }));

    return conversation;
    
  } catch (error) {
    console.error("Error getting first conversation:", error);
    return null;
  }
},
  
  sendMessage: async (sid, body) => {
    const { client } = get();
    if (!client) return;
    try {
    const conv = await client.getConversationBySid(sid);
    const mes = await conv.sendMessage(body);
    console.log("Message sent:", mes);
  } catch (error) {
    console.error("Error sending message:", error);
  }
  },

  addParticipantByIdentity: async (sid, identity) => {
    const { client } = get();
    if (!client) return;
    try {
      const conv = await client.getConversationBySid(sid);
      await conv.add(identity);
      updateParticipants(sid);
      console.log(`Participant ${identity} added to conversation ${sid}`);
    } catch (error) {
      console.error("Error adding participant:", error);
    }
  },

}));

export default useConversationStore;