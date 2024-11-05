import React, { createContext, useState } from 'react';
import { useAuth } from '../utils/AuthContext';

export const FriendsContext = createContext();

const Chat: React.FC = () => {
    const { user, logout } = useAuth();
    const [friends, setFriends] = useState([
        { name: 'Alice', connected: true, img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
        { name: 'Martin', connected: false, img: 'https://placehold.co/200x/ad922e/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
        { name: 'Charlie', connected: true, img: 'https://placehold.co/200x/2e83ad/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
        { name: 'David', connected: false, img: 'https://placehold.co/200x/c2ebff/0f0b14.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
        { name: 'Ella', connected: true, img: 'https://placehold.co/200x/e7c2ff/7315d1.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
        { name: 'Fiona', connected: false, img: 'https://placehold.co/200x/ffc2e2/ffdbdb.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
        { name: 'George', connected: true, img: 'https://placehold.co/200x/f83f3f/4f4f4f.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
        { name: 'Hannah', connected: false, img: 'https://placehold.co/200x/dddddd/999999.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
        { name: 'Ian', connected: true, img: 'https://placehold.co/200x/70ff33/501616.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
        { name: 'Jack', connected: false, img: 'https://placehold.co/200x/30916c/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
    ]);
    return (
        <FriendsContext.Provider value={friends}>
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r border-gray-300">
                {/* Sidebar Header */}
                <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
                    <h1 className="text-2xl font-semibold">Sparq Chat</h1>
                    <div className="relative">
                        <button id="menuButton" className="focus:outline-none cursor-pointer" onClick={() => logout()}>
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
                    {friends.map((contact, index) => (
                        <div key={index} className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                <img
                                    src={contact.img}
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">{contact.name}</h2>
                                <p className={`text-sm ${contact.connected ? 'text-green-500' : 'text-gray-500'}`}>
                                    {contact.connected ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Main Chat Area */}
            <div className="flex-1 relative">
                {/* Chat Header */}
                <header className="bg-white p-4 text-gray-700 border-b border-gray-300">
                    <h1 className="text-2xl font-semibold">Alice</h1>
                </header>
                {/* Chat Messages */}
                <div className="h-screen overflow-y-auto p-4 pb-36">
                    {[
                        { type: 'incoming', message: "Hey Bob, how's it going?", img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                        { type: 'outgoing', message: "Hi Alice! I'm good, just finished a great book. How about you?", img: 'https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                        { type: 'incoming', message: "That book sounds interesting! What's it about?", img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                        { type: 'outgoing', message: "It's about an astronaut stranded on Mars, trying to survive. Gripping stuff!", img: 'https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                        { type: 'incoming', message: "I'm intrigued! Maybe I'll borrow it from you when you're done?", img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                        { type: 'outgoing', message: "Of course! I'll drop it off at your place tomorrow.", img: 'https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                        { type: 'incoming', message: "Thanks, you're the best!", img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                        { type: 'outgoing', message: "Anytime! Let me know how you like it. 😊", img: 'https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                        { type: 'incoming', message: "So, pizza next week, right?", img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                        { type: 'outgoing', message: "Absolutely! Can't wait for our pizza date. 🍕", img: 'https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                        { type: 'incoming', message: "Hoorayy!!", img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' },
                    ].map((chat, index) => (
                        <div key={index} className={`flex mb-4 cursor-pointer ${chat.type === 'outgoing' ? 'justify-end' : ''}`}>
                            {chat.type === 'incoming' && (
                                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                                    <img
                                        src={chat.img}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                </div>
                            )}
                            <div className={`flex max-w-96 ${chat.type === 'incoming' ? 'bg-white text-gray-700' : 'bg-indigo-500 text-white'} rounded-lg p-3 gap-3`}>
                                <p>{chat.message}</p>
                            </div>
                            {chat.type === 'outgoing' && (
                                <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                    <img
                                        src={chat.img}
                                        alt="My Avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/* Chat Input */}
                <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-full">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        <button className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2">
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