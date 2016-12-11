'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _donor = require('./donor');

var _donor2 = _interopRequireDefault(_donor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', function (req, res) {
  return res.send('OK');
});

// mount donor routes at /donors
router.use('/donors', _donor2.default);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
