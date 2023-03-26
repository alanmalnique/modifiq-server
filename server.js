const express = require("express");
const app = express();

let broadcaster;
const port = 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  }
});
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });
  socket.on("broadcasterprof", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcasterprof");
  });
  socket.on("watcherprof", () => {
    socket.to(broadcaster).emit("watcherprof", socket.id);
  });
  socket.on("offerprof", (id, message) => {
    socket.to(id).emit("offerprof", socket.id, message);
  });
  socket.on("answerprof", (id, message) => {
    socket.to(id).emit("answerprof", socket.id, message);
  });
  socket.on("candidateprof", (id, message) => {
    socket.to(id).emit("candidateprof", socket.id, message);
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));