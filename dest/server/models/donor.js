'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Donor Schema
 */
var DonorSchema = new _mongoose2.default.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [/^(00|\+)([0-9]{2})[ ]?([0-9]{3})[ ]?([0-9]{4})[ ]?([0-9]{3})$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  emailAddress: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'The value of path {PATH} ({VALUE}) is not a valid email address'],
    required: true

  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
DonorSchema.method({});

/**
 * Statics
 */
DonorSchema.statics = {
  /**
   * Get donor
   * @param {ObjectId} id - The objectId of donor.
   * @returns {Promise<donor, APIError>}
   */
  get: function get(id) {
    return this.findById(id).execAsync().then(function (donor) {
      if (donor) {
        return donor;
      }
      var err = new _APIError2.default('No such donor exists!', _httpStatus2.default.NOT_FOUND);
      return _bluebird2.default.reject(err);
    });
  },


  /**
   * List donors in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of donors to be skipped.
   * @param {number} limit - Limit number of donors to be returned.
   * @returns {Promise<donor[]>}
   */
  list: function list() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$latMin = _ref.latMin,
        latMin = _ref$latMin === undefined ? -90 : _ref$latMin,
        _ref$lonMin = _ref.lonMin,
        lonMin = _ref$lonMin === undefined ? -180 : _ref$lonMin,
        _ref$latMax = _ref.latMax,
        latMax = _ref$latMax === undefined ? 90 : _ref$latMax,
        _ref$lonMax = _ref.lonMax,
        lonMax = _ref$lonMax === undefined ? 180 : _ref$lonMax,
        _ref$bloodGroupFilter = _ref.bloodGroupFilters,
        bloodGroupFilters = _ref$bloodGroupFilter === undefined ? ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'] : _ref$bloodGroupFilter,
        _ref$limit = _ref.limit,
        limit = _ref$limit === undefined ? 50 : _ref$limit,
        _ref$skip = _ref.skip,
        skip = _ref$skip === undefined ? 0 : _ref$skip;

    return this.where('bloodGroup').in(bloodGroupFilters).where('latitude').gte(latMin).lte(latMax).where('longitude').gte(lonMin).lte(lonMax).sort({ createdAt: -1 }).skip(skip).limit(limit).execAsync();
  }
};

/**
 * @typedef donor
 */
exports.default = _mongoose2.default.model('Donor', DonorSchema);
module.exports = exports['default'];
//# sourceMappingURL=donor.js.map
