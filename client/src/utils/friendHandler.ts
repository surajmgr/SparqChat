import axios from "axios";
import { toast } from "react-toastify";
import { Friend, FriendRequest } from "./typeSafety";

export const sendFriendRequest = async (friendId) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/friend/send-friend-request`,
      {
        recipientId: friendId,
      },
      {
        withCredentials: true,
      }
    );
    toast.info(res.data.message);
  } catch (error) {
    console.error("Failed to send friend request", error);
    toast.error(error.response.data.message);
  }
};

export const acceptFriendRequest = async (friendId, setFriendRequests, setFriends, friendRequests) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/friend/accept-friend-request`,
      {
        requesterId: friendId,
      },
      {
        withCredentials: true,
      }
    );
    setFriendRequests((prev) => prev.filter((friend) => friend.id !== friendId));
    const friendData = friendRequests.find((friend) => friend.id === friendId);
    setFriends((prev) => [...prev, { id: friendId, name: friendData.name, img: friendData.img, online: res.data.online }]);
    toast.info(res.data.message);
  } catch (error) {
    console.error("Failed to accept friend request", error);
    toast.error(error.response.data.message);
  }
};

export const rejectFriendRequest = async (friendId, setFriendRequests) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/friend/reject-friend-request`,
      {
        requesterId: friendId,
      },
      {
        withCredentials: true,
      }
    );
    setFriendRequests((prev) => prev.filter((friend) => friend.id !== friendId));
    toast.info(res.data.message);
  } catch (error) {
    console.error("Failed to reject friend request", error);
    toast.error(error.response.data.message);
  }
};

export const removeFriend = async (friendId, setFriends) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/friend/remove-friend`,
      {
        friendId,
      },
      {
        withCredentials: true,
      }
    );
    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    toast.info(res.data.message);
  } catch (error) {
    console.error("Failed to remove friend", error);
    toast.error(error.response.data.message);
  }
};

export const fetchFriends = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/friend/friends`,
      {
        withCredentials: true,
      }
    );
    return res.data as Friend[];
  } catch (error) {
    console.error("Failed to fetch friends", error);
    toast.error(error.response.data.message);
  }
};

export const fetchFriendRequests = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/friend/friend-requests`,
      {
        withCredentials: true,
      }
    );
    return res.data as FriendRequest[];
  } catch (error) {
    console.error("Failed to fetch friend requests", error);
    toast.error(error.response.data.message);
  }
};
