import { toast } from "react-toastify";
import { socket } from "./socket";

export const handleSocketsEmission = (setFriendRequests, setFriends, setMainChat, friends, friendRequests, mainChat, user) => {
  socket.on("friend_request", (data) => {
    setFriendRequests([...friendRequests, data]);
    toast.info(`New Friend Request: ${data.name}`);
  });

  socket.on("friend_request_accepted", (data) => {
    setFriends([...friends, data]);
    setFriendRequests(friendRequests.filter((friend) => friend.id !== data.id));
    toast.info(`Friend Request Accepted: ${data.name}`);
  });

  socket.on("friend_removed", (data) => {
    setFriends(friends.filter((friend) => friend.id !== data.friendId));
    toast.info(`Friend Removed`);
  });

  socket.on("friend_request_rejected", (data) => {
    setFriendRequests(friendRequests.filter((friend) => friend.id !== data));
    toast.info(`Friend Request Rejected`);
  });

  socket.on("friend_online", (data) => {
    setFriends(
        friends.map((friend) => {
            if (friend.id === data.friendId) {
            return { ...friend, online: true };
            }
            return friend;
        })
        );
    // toast.info(`Friend Online: ${data.friendId}`);
  });

  socket.on("friend_offline", (data) => {
    setFriends(
        friends.map((friend) => {
            if (friend.id === data.friendId) {
            return { ...friend, online: false };
            }
            return friend;
        })
        );
    // toast.info(`Friend Offline: ${data.friendId}`);
  });

  socket.on("new_message", (data) => {
    toast.info(`New Message: ${data.text}`);
    if (data.senderId === mainChat?.id || data.senderId === user.id) {
      setMainChat((prev) => ({
        ...prev,
        messages: [...prev.messages, data],
      }));
    } else {
      setFriends(
        friends.map((friend) => {
          if (friend.id === data.senderId) {
            return {
              ...friend,
              recentMessage: data.text,
            };
          }
          return friend;
        })
      );
    }
  });

//   return () => {
//     socket.off("friend_request");
//     socket.off("friend_request_accepted");
//     socket.off("remove_friend");
//     socket.off("friend_request_rejected");
//     socket.off("friend_online");
//     socket.off("friend_offline");
//   };
};
