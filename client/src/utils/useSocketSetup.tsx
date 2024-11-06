import { useEffect, useState } from "react";
import { socket, connectSocket, disconnectSocket } from "../socket";

const useSocketSetup = (event: string, callback: (data: any) => void) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    connectSocket();

    const handleData = (msg: any) => {
      setData(msg);
      callback(msg);
    };

    socket.on(event, handleData);

    return () => {
      disconnectSocket();
      socket.off(event, handleData);
    };
  }, [event, callback]);

  return data;
};

export default useSocketSetup;
