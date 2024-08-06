import fs from "fs";
import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express(cors());
const io = new Server(createServer(app).listen(8120), {connectionStateRecovery: {}});

app.get("/", (request, reseponse) => {
  reseponse.end(fs.readFileSync("./index.html"));
});
app.get("/js/mpegts.js", (request, reseponse) => {
  reseponse.end(fs.readFileSync("./node_modules/mpegts.js/dist/mpegts.js"));
});

io.on('connection', (socket) => {
  socket.on('chatMessage', (messagePayload) => {
    io.emit('chatMessage', messagePayload);
  });
});
