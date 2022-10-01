const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

export default {
  env: 'development',
  app: app,
  io: io,
  server: server,
  express: express,
  //db: 'mongodb://localhost/blood-bank-development',
  db: 'mongodb+srv://bbuser:bbpassword@cluster0.u9f5g5h.mongodb.net/blooddonors?retryWrites=true&w=majority',
  port: 3000
};
