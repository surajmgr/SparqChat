export type MessageType = "incoming" | "outgoing";

export interface Message {
    type: MessageType;
    message: string;
    img: string;
}

export interface MainChat {
    id: number;
    name: string;
    img: string;
    online: boolean;
    isFriend: boolean;
    messages: Message[];
}

export interface User {
    id: number;
    name: string;
    img: string;
    online: boolean;
    isFriend: boolean;
}

export interface FriendRequest {
    id: number;
    name: string;
    img: string;
}

export interface Friend {
    id: number;
    name: string;
    img: string;
    online: boolean;
}