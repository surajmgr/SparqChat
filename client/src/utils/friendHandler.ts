import axios from "axios";
import { toast } from "react-toastify";
import { Friend, FriendRequest } from "./typeSafety";

export const sendFriendRequest = async (friendId: string): Promise<void> => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/friend/send-friend-request`,
      { recipientId: friendId },
      { withCredentials: true }
    );
    toast.info(res.data.message);
  } catch (error: unknown) {
    console.error("Failed to send friend request", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }
};

export const acceptFriendRequest = async (
  friendId: string,
  setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>,
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>,
  friendRequests: FriendRequest[]
): Promise<void> => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/friend/accept-friend-request`,
      { requesterId: friendId },
      { withCredentials: true }
    );
    
    setFriendRequests((prev) => prev.filter((friend) => friend.id !== friendId));
    const friendData = friendRequests.find((friend) => friend.id === friendId);
    if (friendData) {
      setFriends((prev) => [
        ...prev,
        { id: friendId, name: friendData.name, img: friendData.img, online: res.data.online }
      ]);
    }
    toast.info(res.data.message);
  } catch (error: unknown) {
    console.error("Failed to accept friend request", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }
};

export const rejectFriendRequest = async (
  friendId: string,
  setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>
): Promise<void> => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/friend/reject-friend-request`,
      { requesterId: friendId },
      { withCredentials: true }
    );

    setFriendRequests((prev) => prev.filter((friend) => friend.id !== friendId));
    toast.info(res.data.message);
  } catch (error: unknown) {
    console.error("Failed to reject friend request", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }
};

export const removeFriend = async (
  friendId: string,
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>
): Promise<void> => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/friend/remove-friend`,
      { friendId },
      { withCredentials: true }
    );

    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    toast.info(res.data.message);
  } catch (error: unknown) {
    console.error("Failed to remove friend", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }
};

export const fetchFriends = async (): Promise<Friend[]> => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/friend/friends`,
      { withCredentials: true }
    );
    return res.data as Friend[];
  } catch (error: unknown) {
    console.error("Failed to fetch friends", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    return [];
  }
};

export const fetchFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/friend/friend-requests`,
      { withCredentials: true }
    );
    return res.data as FriendRequest[];
  } catch (error: unknown) {
    console.error("Failed to fetch friend requests", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    return [];
  }
};
