import React, { useContext, useEffect, useState } from "react";
import useConversationStore from "../../Stores/useConversationStore";
import { useAuth } from "../../Context/AuthContext";
// import { getAllUsers } from "../../Services/userService"; // your API function

const TypingIndicator = ({ conversationSid }) => {
  const { activeConversation } = useConversationStore();
  const { user } = useAuth;
  const typingStatus = useConversationStore((state) => state.typingStatus);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const res = await getAllUsers();
        const res = []; 
        setAllUsers(res.data); // assume API returns array of users with identity and profileImageUrl
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  if (!typingStatus[conversationSid]) return null;

  const typingParticipants = Object.values(typingStatus[conversationSid])
    .filter((p) => p.typing);

  if (typingParticipants.length === 0) return null;

  const getProfileImage = (identity) => {
    if (identity === user?.username) return user?.profileImageUrl;

    // Look in activeConversation participants first
    const participant = activeConversation?.participants?.find(
      (p) => p.identity === identity
    );
    if (participant?.profileImageUrl) return participant.profileImageUrl;

    // If not found, check all users fetched
    const userFromAll = allUsers.find((u) => u.username === identity);
    return userFromAll?.profileImageUrl || "/default-avatar.png";
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      {typingParticipants.map((p) => (
        <div key={p.identity} className="flex items-center gap-2">
          <img
            src={getProfileImage(p.identity)}
            alt={p.identity}
            className="w-6 h-6 rounded-full"
          />
          <div className="px-3 py-1 bg-gray-200 rounded-full flex gap-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TypingIndicator;