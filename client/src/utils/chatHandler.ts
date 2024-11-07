import axios from "axios";
import { MainChat, Message } from "./typeSafety";
import { toast } from "react-toastify";

interface SendMessageResponse {
  success: boolean;
}

export const fetchRandomChat = async (): Promise<MainChat> => {
  try {
    const res = await axios.get<MainChat>(
      `${import.meta.env.VITE_API_BASE_URL}/chat/random`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error: any) {
    console.error("Failed to fetch random chat", error);
    toast.error(error.response?.data?.message || "An error occurred");
    throw new Error("Failed to fetch random chat");
  }
};

export const sendMessage = async (
  message: string,
  receiverId: string,
  senderId: string,
  setMainChat: React.Dispatch<React.SetStateAction<MainChat | null>>
): Promise<void> => {
  try {
    const res = await axios.post<SendMessageResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/chat/send`,
      {
        message,
        receiverId,
      },
      {
        withCredentials: true,
      }
    );
    if (res.data.success) {
      // add the message to the chat
      setMainChat((prev) => {
        if (!prev) return null;
        const newMessages: Message[] = [
          ...prev.messages,
          {
            id: Math.random().toString(),
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
    }
  } catch (error: any) {
    console.error("Failed to send message", error);
    toast.error(error.response?.data?.message || "An error occurred");
  }
};

export const fetchChatMessages = async (
  userId: string,
  chatUserId: string,
  chatEmail: string
): Promise<MainChat> => {
  try {
    const res = await axios.post<MainChat>(
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
  } catch (error: any) {
    console.error("Failed to fetch chat messages", error);
    toast.error(error.response?.data?.message || "An error occurred");
    throw new Error("Failed to fetch chat messages");
  }
};
