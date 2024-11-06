import axios from "axios";
import { MainChat, Message } from "./typeSafety";
import { toast } from "react-toastify";

interface FetchChatMessagesResponse {
  messages: Message[];
}

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
  receiverId: number,
  senderId: number,
  setMainChat: React.Dispatch<React.SetStateAction<MainChat>>
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
    }
  } catch (error: any) {
    console.error("Failed to send message", error);
    toast.error(error.response?.data?.message || "An error occurred");
  }
};

export const fetchChatMessages = async (
  userId: number,
  chatUserId: number,
  chatEmail: string
): Promise<FetchChatMessagesResponse> => {
  try {
    const res = await axios.post<FetchChatMessagesResponse>(
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
