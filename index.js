"use strict";
const path = require("path");
const express = require("express");
const homeRoute = require("./routes/router");
const dotenv = require("dotenv");
const { getNameFromURL, removeUser } = require("./utils/users");
dotenv.config({ path: path.join(__dirname, "config/.env") });
const PORT = process.env.PORT || 3000;
const app = express();

const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeRoute);

let listOfUsers = [];
let users = {};

io.on("connection", (socket) => {
  let urlWithName = socket.handshake.headers.referer;
  let username = getNameFromURL(urlWithName);
  users[socket.id] = username;

  socket.broadcast.emit("user joined", username);

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("message", { msg: msg, username: users[socket.id] });
  });

  socket.on("disconnect", () => {
    let username = getNameFromURL(socket.handshake.headers.referer);
    removeUser(listOfUsers, username);
    socket.broadcast.emit("user left", username);
  });
});

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
