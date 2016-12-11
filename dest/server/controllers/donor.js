'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _donor = require('../models/donor');

var _donor2 = _interopRequireDefault(_donor);

var _env = require('../config/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io = _env2.default.io;

/**
 * Load donor and append to req.
 */
function load(req, res, next, id) {
  _donor2.default.get(id).then(function (donor) {
    req.donor = donor; // eslint-disable-line no-param-reassign
    return next();
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Get donor
 * @returns {donor}
 */
function get(req, res) {
  return res.json(req.donor);
}

/**
 * Create new donor
 * @property {string} req.body.donorname - The donorname of donor.
 * @property {string} req.body.mobileNumber - The mobileNumber of donor.
 * @returns {donor}
 */
function create(req, res, next) {
  var ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var donor = new _donor2.default({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bloodGroup: req.body.bloodGroup,
    emailAddress: req.body.emailAddress,
    mobileNumber: req.body.mobileNumber,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    ipAddress: ipAddress,
    address: req.body.address
  });

  donor.saveAsync().then(function (savedDonor) {
    res.json(savedDonor);
    io.emit('DONOR_ADDED', savedDonor);
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Update existing donor
 * @property {string} req.body.donorname - The donorname of donor.
 * @property {string} req.body.mobileNumber - The mobileNumber of donor.
 * @returns {donor}
 */
function update(req, res, next) {
  var donor = req.donor;
  donor.firstName = req.body.firstName;
  donor.lastName = req.body.lastName;
  donor.bloodGroup = req.body.bloodGroup;
  donor.emailAddress = req.body.emailAddress;
  donor.mobileNumber = req.body.mobileNumber;
  donor.latitude = req.body.latitude;
  donor.longitude = req.body.longitude;
  donor.ipAddress = req.ip;
  donor.address = req.body.address;

  donor.saveAsync().then(function (savedDonor) {
    res.json(savedDonor);io.emit('DONOR_UPDATED', savedDonor);
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Get donor list.
 * @property {number} req.query.skip - Number of donors to be skipped.
 * @property {number} req.query.limit - Limit number of donors to be returned.
 * @returns {donor[]}
 */
function list(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 1000 : _req$query$limit,
      _req$query$skip = _req$query.skip,
      skip = _req$query$skip === undefined ? 0 : _req$query$skip,
      _req$query$latMin = _req$query.latMin,
      latMin = _req$query$latMin === undefined ? -90 : _req$query$latMin,
      _req$query$lonMin = _req$query.lonMin,
      lonMin = _req$query$lonMin === undefined ? -180 : _req$query$lonMin,
      _req$query$latMax = _req$query.latMax,
      latMax = _req$query$latMax === undefined ? 90 : _req$query$latMax,
      _req$query$lonMax = _req$query.lonMax,
      lonMax = _req$query$lonMax === undefined ? 180 : _req$query$lonMax,
      _req$query$bloodGroup = _req$query.bloodGroupFilters,
      bloodGroupFilters = _req$query$bloodGroup === undefined ? ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'] : _req$query$bloodGroup;

  _donor2.default.list({ latMin: latMin, lonMin: lonMin, latMax: latMax, lonMax: lonMax, bloodGroupFilters: bloodGroupFilters, limit: limit, skip: skip }).then(function (donors) {
    return res.json(donors);
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Delete donor.
 * @returns {donor}
 */
function remove(req, res, next) {
  var donor = req.donor;
  donor.removeAsync().then(function (deletedDonor) {
    res.json(deletedDonor);io.emit('DONOR_REMOVED', deletedDonor._id);
  }).error(function (e) {
    return next(e);
  });
}

exports.default = { load: load, get: get, create: create, update: update, list: list, remove: remove };
module.exports = exports['default'];
//# sourceMappingURL=donor.js.map
