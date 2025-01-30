import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { connectSocket, sendMessage as socketSendMessage, listenToMessages, listenToTyping, typing, getSocket } from "../config/socketService.js";
import "./HomePage.css";
import { jwtDecode } from "jwt-decode";


const HomePage = () => {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [newUserId, setNewUserId] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const messageListRef = useRef(null);

  const token = localStorage.getItem("token")?.replace(/"/g, "");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken?.id);
    }
  }, [token]);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.senders;

        if (Array.isArray(userData)) {
          setUsers(userData);
        } else if (userData === null || userData === undefined) {
          setUsers([]);
          console.warn("Users data is null or undefined. Setting to empty array.");
        } else {
          setUsers([]);
          console.warn("Users data is not an array. Setting to empty array.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      console.error("Token not found, please log in.");
    }
  }, [token]);


  useEffect(() => {
    if (userId) {
        connectSocket(userId);
        

        listenToMessages((message) => {
            console.log("New message received:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        let typingTimeout;

        listenToTyping((user) => {
          console.log("User is typing:", user);
          setTypingUser(user);
        
          if (typingTimeout) clearTimeout(typingTimeout);
          typingTimeout = setTimeout(() => setTypingUser(null), 2000);
        });
        

        const socket = getSocket();
        socket.emit("join", userId);

        socket.on("user-offline", (offlineUserId) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === offlineUserId ? { ...user, isOnline: false } : user
            )
          );
        });
    
        socket.on("user-online", (onlineUserId) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === onlineUserId ? { ...user, isOnline: true } : user
            )
          );
        });
      }    
}, [userId]);



  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);
  


  const handleUserClick = (user) => {
    console.log(user);
    if (user && user._id || user.id) {
      setSelectedUser(user);
      setMessages([]);
      fetchMessages(user._id || user.id);
    } else {
      console.error('Invalid user clicked:', user);
    }
  };

  const fetchMessages = async (receiverId) => {
    if (!receiverId) {
      console.error("Receiver ID is missing");
      return;
    }
  
    try {
      // console.log(receiverId)
      const response = await axios.post("http://localhost:3000/message", { receiverId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data)
      setMessages(response.data.messages || []);
    } catch (error) {
      console.log("Error fetching messages:", error, error.response?.data || error.message);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage && selectedUser) {
      try {
        const currentReceivedId = selectedUser._id || selectedUser.id;
        const messageData = {
          receiverId: currentReceivedId,
          message: newMessage,
        };

        await axios.post("http://localhost:3000/send", messageData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        socketSendMessage(userId, currentReceivedId, newMessage);
        setMessages((prevMessages) => [...prevMessages, { sender: "You", message: newMessage }]);

        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleTyping = () => {
    if (selectedUser && newMessage.trim()) {
      typing(userId, selectedUser._id || selectedUser.id);
    }
  };


  const handleAddUser = async () => {
    if (newUserId && initialMessage) {
      try {
        const newUser = { id: newUserId, name: newUserId };
        setUsers((prevUsers) => [...prevUsers, newUser]);

        socketSendMessage(userId, newUserId, initialMessage);
        setNewUserId("");
        setInitialMessage("");
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };


    return (
    <section className="vh-100 bg-image" style={{
      backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
    }}>
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-4">Welcome To Chat App </h2>
                  <br />

                  <div className="row">
                    <div className="col-4">
                      <h3>Users List:</h3>
                      <ul className="list-group">
                        
                      {Array.isArray(users) && users.length > 0 ? (
                        <ul className="list-group">
                          {users.map((user) => (
                            <li key={user._id} className="list-group-item" onClick={() => handleUserClick(user)}>
                              {user._id} {user.isOnline ? "🟢 Online" : "🔴 Offline"}
                            </li>
                          ))}

                        </ul>
                        ) : (
                          <p>No Users Available</p>
                        )}
                      </ul>

                      <div className="mt-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter new user ID"
                          value={newUserId}
                          onChange={(e) => setNewUserId(e.target.value)}
                        />
                        <textarea
                          className="form-control mt-2"
                          placeholder="Enter initial message"
                          value={initialMessage}
                          onChange={(e) => setInitialMessage(e.target.value)}
                        />
                        <button className="btn btn-success mt-2" onClick={handleAddUser}>
                          Add New User and Send Message
                        </button>
                      </div>
                    </div>

                    <div className="col-8">
                      {selectedUser ? (
                        <>
                          <h3>Chat with {selectedUser.username}</h3>
                          <div className="chat-box" style={{ height: "300px", overflowY: "scroll" }}>
                            {Array.isArray(messages) && messages.length > 0 ? (
                              messages.map((mess) => (
                                <div key={mess._id || mess.index} className={mess.senderId === userId ? "sent" : "received"}>
                                  <p>{mess.message}</p>
                                </div>
                              ))
                            ) : (
                              <p>No messages available</p>
                            )}
                          </div>

                          {typingUser && typingUser !== userId && (
                            <p>User is typing: {typingUser?.senderId}</p>
                          )}

                          {selectedUser && !selectedUser.isOnline && (
                            <p className="text-danger">This user is offline</p>
                          )}

                          <div className="message-input mt-3">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyUp={handleTyping}
                              placeholder="Type a message"
                              className="form-control"
                            />
                            <button className="btn btn-primary mt-2" onClick={handleSendMessage}>Send</button>
                          </div>
                        </>
                      ) : (
                        <p>Select a user to start chatting</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );


};

export default HomePage;