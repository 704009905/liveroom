import fs from "fs";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
app.use(express.static("public"));
const io = new Server(createServer(app).listen(8120), {
  connectionStateRecovery: {},
});

app.get("/", (request, reseponse) => {
  reseponse.end(fs.readFileSync("./index.html"));
});

io.on("connection", (socket) => {
  socket.on("chatMessage", (messagePayload) => {
    io.emit("chatMessage", messagePayload);
  });
});
