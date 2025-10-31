import { io } from "socket.io-client";

const userId = process.argv[2] || "guest";

const socket = io("http://localhost:2500", {
  query: { userId },
}); //automatically connects to the server sending the userId

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);

  // socket.emit("sendMessage", {
  //   text: "Hello from client1",
  // });

  socket.on("newMessages", (data) => {
    console.log(data);
  });
});

socket.on("disconnect", (reason) => console.log(" Disconnected:", reason));

socket.on("getOnlineUsers", (users) => {
  console.log("Online users:", users);
});

// newMessages
