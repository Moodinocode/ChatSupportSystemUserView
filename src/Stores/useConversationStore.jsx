// src/store/useConversationStore.js
import { create } from "zustand";
import { Client } from "@twilio/conversations";
// import { getAllUsers } from "../Services/userService";
import {updateTypingIndicator}  from "../utils/updateTypingIndicator";


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
        get().updateParticipants(participant.conversation.sid);
      });

      set({ client, loading: false });
      
      // Fetch initial conversations
      await get().getConversations();
      
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
      ? { ...c, ...builtconversation, lastActivity: c.lastActivity } // keep old lastActivity
      : c
  ),
}));



// Attach typing listeners to the Twilio conversation object
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

leaveConversation: async (sid) => {
    const { client, activeConversation, conversations } = get();
    if (!client) return;
    try {
      const conv = await client.getConversationBySid(sid);
      await conv.leave();
      set({
        conversations: conversations.filter((c) => c.conversation.sid !== sid),
        activeConversation:
          activeConversation?.conversation.sid === sid
            ? null
            : activeConversation,
      });
    } catch (error) {
      console.error("Error leaving conversation:", error);
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

  createConversation: async (newConversationName,selectedUsers) => {
    const { client } = get();
    if (!client) return;

    try {
      console.log("Creating conversation:", newConversationName, "with users:", selectedUsers);
      const conversation = await client.createConversation({
        attributes: {},
        friendlyName: newConversationName,
        uniqueName: newConversationName+ Math.random().toString(36).substring(2, 15), 
      });
      console.log("Conversation created:", conversation.sid);
      
      get().addParticipants(conversation.sid, selectedUsers).then(() => {
        console.log("Participants added successfully")
        }
        ).catch((error) => {
          console.error("Error adding participants:", error);
        }
      );
      
      // if (selectedUsers && selectedUsers.length > 0) {
      //   await Promise.all(
      //     selectedUsers.map((user) => conversation.add(participant))
      //   );
      // }

      get().syncConversation(conversation);
      return conversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  },

addParticipants: async (sid, participants) => {
  const { client } = get();
  if (!client) return;

  try {
    const conv = await client.getConversationBySid(sid);
    // const res = await getAllUsers();
    const res = [];
    console.log("Fetched users:", res);

    // Filter users to add
    const usersToAdd = res.data.filter(u => participants.includes(u.id));

    for (const user of usersToAdd) {
      const identity = String(user.username); // ensure string
      console.log(`Adding participant with identity: ${identity}`);
      
      try {
        await conv.add(identity);
        console.log(`Added participant: ${identity}`);
      } catch (error) {
        console.error(`Failed to add participant ${identity}:`, error);
        //  try {
        //     await conv.P; // Your function to create the user/identity
        //     console.log(`Identity created for ${identity}, retrying add...`);
        //     await conv.add(identity); // Retry adding
        //     console.log(`Added participant after creating identity: ${identity}`);
        //   } catch (creationError) {
        //     console.error(`Failed to create/re-add participant ${identity}:`, creationError);
        //   }
      }
    }

    await get().updateParticipants(sid);
  } catch (err) {
    console.error("Failed to add participants:", err);
  }
},


  removeParticipant: async (sid, participant) => {
    await apiRemoveParticipant(sid, participant);
  },
}));

export default useConversationStore;