'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  // POST /api/donors
  createDonor: {
    body: {
      firstName: _joi2.default.string().required(),
      lastName: _joi2.default.string().required(),
      mobileNumber: _joi2.default.string().regex(/^(00|\+)([0-9]{2})[ ]?([0-9]{3})[ ]?([0-9]{4})[ ]?([0-9]{3})$/).required(),
      emailAddress: _joi2.default.string().email().required(),
      bloodGroup: _joi2.default.any().valid(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']).required(),
      ipAddress: _joi2.default.string().ip({ version: ['ipv4', 'ipv6'] }),
      latitude: _joi2.default.number().required(),
      longitude: _joi2.default.number().required(),
      address: _joi2.default.string().required()
    }
  },

  // UPDATE /api/donors/:donorId
  updateDonor: {
    body: {
      firstName: _joi2.default.string().required(),
      lastName: _joi2.default.string().required(),
      mobileNumber: _joi2.default.string().regex(/^(00|\+)([0-9]{2})[ ]?([0-9]{3})[ ]?([0-9]{4})[ ]?([0-9]{3})$/).required(),
      emailAddress: _joi2.default.string().email().required(),
      bloodGroup: _joi2.default.any().valid(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']).required(),
      ipAddress: _joi2.default.string().ip({ version: ['ipv4', 'ipv6'] }),
      latitude: _joi2.default.number().required(),
      longitude: _joi2.default.number().required(),
      address: _joi2.default.string().required()
    },
    params: {
      donorId: _joi2.default.string().hex().required()
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=donor-param-validation.js.map
