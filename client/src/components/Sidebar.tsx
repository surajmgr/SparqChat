import React from 'react';
import { acceptFriendRequest, rejectFriendRequest } from '../utils/friendHandler';
import { fetchChatMessages } from '../utils/chatHandler';

interface Contact {
    id: number;
    name: string;
    img: string;
    connected: boolean;
}

interface SidebarProps {
    friends: Contact[];
    friendRequests: Contact[];
    logout: () => void;
    setFriendRequests: React.Dispatch<React.SetStateAction<Contact[]>>;
    setFriends: React.Dispatch<React.SetStateAction<Contact[]>>;
}

const Sidebar: React.FC<SidebarProps> = ({ friends, friendRequests, logout, setFriendRequests, setFriends, mainChat, setMainChat, user }) => {

    const fetchChatFriend = async (contact: Contact) => {
        if (mainChat && mainChat.id === contact.id) return
        try {
            const chat = await fetchChatMessages(user.id, contact.id, contact.email);
            setMainChat(chat);
        } catch (error) {
            console.error("Failed to fetch chat friend", error);
        }
    }
    
    return (
        <div className="w-1/4 bg-white border-r border-gray-300">
            {/* Sidebar Header */}
            <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
                <h1 className="text-2xl font-semibold">Sparq Chat</h1>
                <div className="relative flex gap-2">
                    <button
                        className="focus:outline-none cursor-pointer"
                        onClick={() => {
                            // take username and fetch chat messages from the server using prompt
                            const email = prompt("Enter email");
                            if (email) {
                                fetchChatFriend({ id: null, name, email, img: "", connected: false });
                            }
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-100"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <button
                        id="menuButton"
                        className="focus:outline-none cursor-pointer"
                        onClick={logout}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-100"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h10a1 1 0 011 1v3a1 1 0 11-2 0V5H5v10h8v-2a1 1 0 112 0v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm10.293 5.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 13H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </header>
            {/* Contact List */}
            <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
                <h2 className="text-xl font-semibold mb-2">Friends</h2>
                {friends.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">No friends yet</p>
                    </div>
                ) : (
                    friends.map((contact, index) => (
                        <div
                            key={index}
                            className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                            onClick={() => fetchChatFriend(contact)}
                        >
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                <img
                                    src={contact.img}
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">{contact.name}</h2>
                                <p
                                    className={`text-sm ${
                                        contact.online ? "text-green-500" : "text-gray-500"
                                    }`}
                                >
                                    {contact.online ? "Online" : "Offline"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <h2 className="text-xl font-semibold mb-2">Friend Requests</h2>
                {friendRequests.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">No friend requests yet</p>
                    </div>
                ) : (
                    friendRequests.map((contact, index) => (
                        <div
                            key={index}
                            className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                            onClick={() => fetchChatFriend(contact)}
                        >
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                <img
                                    src={contact.img}
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">{contact.name}</h2>
                                <p
                                    className={`text-sm ${
                                        contact.online ? "text-green-500" : "text-gray-500"
                                    }`}
                                >
                                    {contact.online ? "Online" : "Offline"}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded-md cursor-pointer"
                                        onClick={() => acceptFriendRequest(contact.id, setFriendRequests, setFriends, friendRequests)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer"
                                        onClick={() => rejectFriendRequest(contact.id, setFriendRequests)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;