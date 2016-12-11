"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

exports.default = {
  env: 'test',
  app: app,
  io: io,
  server: server,
  express: express,
  db: 'mongodb://localhost/blood-bank-test',
  port: 3000
};
module.exports = exports['default'];
//# sourceMappingURL=test.js.map
