"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

exports.default = {
  env: 'development',
  app: app,
  io: io,
  server: server,
  express: express,
  db: 'mongodb://bbuser:bbpassword@ds145245.mlab.com:45245/blooddonors',
  port: 3000
};
module.exports = exports['default'];
//# sourceMappingURL=development.js.map
