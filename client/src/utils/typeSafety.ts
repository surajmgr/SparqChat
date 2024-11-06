export type MessageType = "incoming" | "outgoing";

export interface Message {
    type: MessageType;
    message: string;
    img: string;
}

export interface MainChat {
    id: string;
    name: string;
    img: string;
    online: boolean;
    isFriend: boolean;
    messages: Message[];
}

export interface User {
    id: string;
    name: string;
    img: string;
    online: boolean;
    isFriend: boolean;
}

export interface FriendRequest {
    id: string;
    name: string;
    img: string;
}

export interface Friend {
    id: string;
    name: string;
    img: string;
    online: boolean;
}