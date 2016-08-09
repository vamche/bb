const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

export default {
  env: 'test',
  app: app,
  io: io,
  server: server,
  express: express,
  db: 'mongodb://localhost/blood-bank-test',
  port: 3000
};
