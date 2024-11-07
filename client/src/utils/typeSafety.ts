export type MessageType = "incoming" | "outgoing";

export interface Message {
    id: string;
    text: string;
    timestamp: string;
    senderId: string;
    receiverId: string;
}

export interface MainChat {
    id: string;
    name: string;
    img: string;
    myImg: string;
    online: boolean;
    isFriend: boolean;
    messages: Message[];
}

export interface User {
    id: string;
    email: string;
    socketId: string;
}

export interface FriendRequest {
    id: string;
    name: string;
    email: string;
    img: string;
    online: boolean;
}

export interface Friend {
    id: string;
    name: string;
    email: string;
    img: string;
    online: boolean;
}