import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
    socket = io("http://localhost:3000", {
        query: { userId }
    });
};

export const sendMessage = (senderId, receiverId, message) => {
    socket.emit("send_message", { senderId, receiverId, message });
};

export const typing = (senderId, receiverId) => {
    socket.emit("typing", { senderId, receiverId });
};

export const listenToMessages = (callback) => {
    const socket = getSocket();
    if (!socket) return;
  
    socket.on("receive_message", (message) => {
      console.log("Message received in frontend:", message);
      callback(message);
    });
};
  

export const listenToTyping = (callback) => {
    socket.on("typing", (senderId) => {
        callback(senderId);
    });
};

export const getSocket = () => socket;