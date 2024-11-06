import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { socket, connectSocket, disconnectSocket } from "../utils/socket";
import axios from "axios";
import { toast } from "react-toastify";
import { handleSocketsEmission } from "../utils/socketHandler";
import { Friend, FriendRequest, MainChat } from "../utils/typeSafety";
import { fetchRandomChat, sendMessage } from "../utils/chatHandler";
import {
  acceptFriendRequest,
  fetchFriendRequests,
  fetchFriends,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "../utils/friendHandler";
import Sidebar from "./Sidebar";

export const FriendsContext = createContext();

const Chat: React.FC = () => {
  const { user, logout } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [mainChat, setMainChat] = useState<MainChat | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    connectSocket();
    handleSocketsEmission(
      setFriendRequests,
      setFriends,
      setMainChat,
      friends,
      friendRequests,
      mainChat,
      user
    );
    fetchRandomChat().then((chat) => setMainChat(chat));
    fetchFriends().then((friends) => setFriends(friends));
    fetchFriendRequests().then((requests) => setFriendRequests(requests));
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const chatMessages = document.getElementById("chat-messages");
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [mainChat?.messages]);

  const sendMessageWrap = async () => {
    if (!inputMessage) {
      toast.error("Message cannot be empty.");
      return;
    }
    await sendMessage(inputMessage, mainChat?.id, user.id, setMainChat);
    setInputMessage("");
  };

  return (
    <FriendsContext.Provider value={friends}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          friends={friends}
          friendRequests={friendRequests}
          logout={logout}
          setFriendRequests={setFriendRequests}
          setFriends={setFriends}
          mainChat={mainChat}
          setMainChat={setMainChat}
          user={user}
        />
        {/* Main Chat Area */}
        <div className="flex-1 relative">
          {/* Chat Header */}
          <header className="bg-white p-4 text-gray-700 border-b border-gray-300 flex justify-between items-center">
            <h1 className="text-2xl font-semibold">{mainChat?.name}</h1>
            {friends && friends.some((friend) => friend.id === mainChat?.id) ? (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
                onClick={() => removeFriend(mainChat?.id, setFriends)}
              >
                Remove Friend
              </button>
            ) : friendRequests &&
              friendRequests.some(
                (request) =>
                  request.id === mainChat?.id || request.from === mainChat?.id
              ) ? (
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer"
                  onClick={() =>
                    acceptFriendRequest(
                      mainChat?.id,
                      setFriendRequests,
                      setFriends,
                      friendRequests
                    )
                  }
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
                  onClick={() =>
                    rejectFriendRequest(mainChat?.id, setFriendRequests)
                  }
                >
                  Reject
                </button>
              </div>
            ) : (
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded-md cursor-pointer"
                onClick={() => sendFriendRequest(mainChat.id)}
              >
                Add Friend
              </button>
            )}
          </header>
          {/* Chat Messages */}
          <div id="chat-messages" className="h-screen overflow-y-auto p-4 pb-36">
            {!mainChat || mainChat.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No messages yet</p>
              </div>
            ) : (
              mainChat.messages.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex mb-4 ${
                    chat.senderId === user.id ? "justify-end" : ""
                  }`}
                >
                  {chat.senderId !== user.id && (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                      <img
                        src={mainChat.img}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  )}
                  <div
                    className={`flex max-w-96 ${
                      chat.senderId !== user.id
                        ? "bg-gray-200 text-gray-700"
                        : "bg-indigo-500 text-white"
                    } rounded-lg p-3 gap-3`}
                  >
                    <p
                      className="text-sm"
                      title={new Date(chat.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    >
                      {chat.text}
                    </p>
                  </div>
                  {chat.senderId === user.id && (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                      <img
                        src={mainChat.myImg}
                        alt="My Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          {/* Chat Input */}
          <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-full">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={async (e) => {
                  if (e.key === "Enter") {
                    await sendMessageWrap();
                  }
                }}
                className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2 cursor-pointer"
                onClick={sendMessageWrap}
              >
                Send
              </button>
            </div>
          </footer>
        </div>
      </div>
    </FriendsContext.Provider>
  );
};

export default Chat;
