import axios from "axios";
import { MainChat } from "./typeSafety";
import { toast } from "react-toastify";

export const fetchRandomChat = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/chat/random`,
      {
        withCredentials: true,
      }
    );
    return res.data as MainChat;
  } catch (error) {
    console.error("Failed to fetch random chat", error);
    toast.error(error.response.data.message);
    throw new Error("Failed to fetch random chat");
  }
};

export const sendMessage = async (message: string, receiverId: number, senderId: number, setMainChat: React.Dispatch<React.SetStateAction<MainChat>>) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/chat/send`,
      {
        message,
        receiverId,
      },
      {
        withCredentials: true,
      }
    );
    // add the message to the chat
    setMainChat((prev) => {
      const newMessages = [
        ...prev.messages,
        {
          id: prev.messages.length + 1,
          text: message,
          timestamp: new Date().toISOString(),
          senderId,
          receiverId,
        },
      ];
      return {
        ...prev,
        messages: newMessages,
      };
    });
  } catch (error) {
    console.error("Failed to send message", error);
    toast.error(error.response.data.message);
  }
}

export const fetchChatMessages = async (userId: number, chatUserId: number, chatEmail: string) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/chat/messages`,
      {
        userId,
        chatUserId,
        chatEmail,
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to fetch chat messages", error);
    toast.error(error.response.data.message);
    throw new Error("Failed to fetch chat messages");
  }
};
