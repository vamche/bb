'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _expressWinston = require('express-winston');

var _expressWinston2 = _interopRequireDefault(_expressWinston);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _winston = require('./server/config/winston');

var _winston2 = _interopRequireDefault(_winston);

var _routes = require('./server/routes');

var _routes2 = _interopRequireDefault(_routes);

var _env = require('./server/config/env');

var _env2 = _interopRequireDefault(_env);

var _APIError = require('./server/helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _env2.default.app;
var server = _env2.default.server;
var io = _env2.default.io;
var debug = require('debug')('blood-donors:index');
var express = _env2.default.express;

// promisify mongoose
_bluebird2.default.promisifyAll(_mongoose2.default);

// connect to mongo db
_mongoose2.default.connect(_env2.default.db, { server: { reconnectTries: Number.MAX_VALUE } });
_mongoose2.default.connection.on('error', function () {
  throw new Error('unable to connect to database: ' + _env2.default.db);
});

// listen on port config.port
server.listen(process.env.PORT || _env2.default.port, function () {
  console.log('server started on port ' + _env2.default.port + ' (' + _env2.default.env + ')');
  debug('server started on port ' + _env2.default.port + ' (' + _env2.default.env + ')');
});

// Set socket.io listeners.
io.on('connection', function (socket) {
  console.log('Client Connected...');
  socket.on('disconnect', function () {
    console.log('Client Disconnected.');
  });
});

if (_env2.default.env === 'development') {
  app.use((0, _morgan2.default)('dev'));
}

// parse body params and attache them to req.body
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _cookieParser2.default)());
app.use((0, _compression2.default)());
app.use((0, _methodOverride2.default)());
// secure apps by setting various HTTP headers
app.use((0, _helmet2.default)());
// enable CORS - Cross Origin Resource Sharing
app.use((0, _cors2.default)());

// enable detailed API logging in dev env
if (_env2.default.env === 'development') {
  _expressWinston2.default.requestWhitelist.push('body');
  _expressWinston2.default.responseWhitelist.push('body');
  app.use(_expressWinston2.default.logger({
    winstonInstance: _winston2.default,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

// mount all routes on /api path
app.use('/api', _routes2.default);

app.use(express.static(__dirname + '/../'));

app.get("/", function (req, res) {
  //res.sendText('dirname --> ' +  __dirname);
  res.sendFile('index.html');
});

app.get("/:donorId", function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname + '/../index.html'));
});

// if error is not an instanceOf APIError, convert it.
app.use(function (err, req, res, next) {
  if (err instanceof _expressValidation2.default.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    var unifiedErrorMessage = err.errors.map(function (error) {
      return error.messages.join('. ');
    }).join(' and ');
    var error = new _APIError2.default(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof _APIError2.default)) {
    var apiError = new _APIError2.default(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new _APIError2.default('API not found', _httpStatus2.default.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (_env2.default.env !== 'test') {
  app.use(_expressWinston2.default.errorLogger({
    winstonInstance: _winston2.default
  }));
}

// error handler, send stacktrace only during development
app.use(function (err, req, res, next) {
  return (// eslint-disable-line no-unused-vars
    res.status(err.status).json({
      message: err.isPublic ? err.message : _httpStatus2.default[err.status],
      stack: _env2.default.env === 'development' ? err.stack : {}
    })
  );
});

exports.default = app;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
