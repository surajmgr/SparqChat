import { toast } from "react-toastify";
import { socket } from "./socket";
import { Friend, FriendRequest, MainChat, User } from "./typeSafety";

interface SocketHandlerProps {
  setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>;
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  setMainChat: React.Dispatch<React.SetStateAction<MainChat | null>>;
  friends: Friend[];
  friendRequests: FriendRequest[];
  mainChat: MainChat | null;
  user: User;
}

export const handleSocketsEmission = ({
  setFriendRequests,
  setFriends,
  setMainChat,
  friends,
  friendRequests,
  mainChat,
  user,
}: SocketHandlerProps) => {
  socket.on("friend_request", (data: FriendRequest) => {
    setFriendRequests([...friendRequests, data]);
    toast.info(`New Friend Request: ${data.name}`);
  });

  socket.on("friend_request_accepted", (data: Friend) => {
    setFriends([...friends, data]);
    setFriendRequests(friendRequests.filter((friend) => friend.id !== data.id));
    toast.info(`Friend Request Accepted: ${data.name}`);
  });

  socket.on("friend_removed", (data: { friendId: string }) => {
    setFriends(friends.filter((friend) => friend.id !== data.friendId));
    toast.info(`Friend Removed`);
  });

  socket.on("friend_request_rejected", (data: string) => {
    setFriendRequests(friendRequests.filter((friend) => friend.id !== data));
    toast.info(`Friend Request Rejected`);
  });

  socket.on("friend_online", (data: { friendId: string }) => {
    setFriends(
      friends.map((friend) => {
        if (friend.id === data.friendId) {
          return { ...friend, online: true };
        }
        return friend;
      })
    );
  });

  socket.on("friend_offline", (data: { friendId: string }) => {
    setFriends(
      friends.map((friend) => {
        if (friend.id === data.friendId) {
          return { ...friend, online: false };
        }
        return friend;
      })
    );
  });

  socket.on("new_message", (data: { senderId: string; message: string }) => {
    if (data.senderId === mainChat?.id || data.senderId === user.id) {
      setMainChat((prev) => ({
        ...prev,
        messages: [...prev?.messages, data],
      }));
    } else {
      toast.info(`New Message from ${data.senderId}`);
    }
  });
};
