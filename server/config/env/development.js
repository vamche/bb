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
  db: 'mongodb://bbuser:bbpassword@ds145245.mlab.com:45245/blooddonors',
  port: 3000
};
