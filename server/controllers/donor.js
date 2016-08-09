import Donor from '../models/donor';
import config from '../config/env';
const io = config.io;

/**
 * Load donor and append to req.
 */
function load(req, res, next, id) {
  Donor.get(id).then((donor) => {
    req.donor = donor;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
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
  // console.log("req" + JSON.string(req));
  const donor = new Donor({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bloodGroup: req.body.bloodGroup,
    emailAddress: req.body.emailAddress,
    mobileNumber: req.body.mobileNumber,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    ipAddress: req.ip,
    address: req.body.address
  });

  donor.saveAsync()
    .then((savedDonor) => {
                        res.json(savedDonor);
                        io.emit('DONOR_ADDED', savedDonor);
                      })
    .error((e) => next(e));
}

/**
 * Update existing donor
 * @property {string} req.body.donorname - The donorname of donor.
 * @property {string} req.body.mobileNumber - The mobileNumber of donor.
 * @returns {donor}
 */
function update(req, res, next) {
  const donor = req.donor;
  donor.firstName = req.body.firstName;
  donor.lastName = req.body.lastName;
  donor.bloodGroup = req.body.bloodGroup;
  donor.emailAddress = req.body.emailAddress;
  donor.mobileNumber = req.body.mobileNumber;
  donor.latitude = req.body.latitude;
  donor.longitude = req.body.longitude;
  donor.ipAddress = req.ip;
  donor.address = req.body.address;

  donor.saveAsync()
    .then((savedDonor) => {res.json(savedDonor); io.emit('DONOR_UPDATED', savedDonor);})
    .error((e) => next(e));
}

/**
 * Get donor list.
 * @property {number} req.query.skip - Number of donors to be skipped.
 * @property {number} req.query.limit - Limit number of donors to be returned.
 * @returns {donor[]}
 */
function list(req, res, next) {
  const { limit = 1000, skip = 0, latMin = -90, lonMin = -180, latMax = 90, lonMax = 180, bloodGroupFilters = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']} = req.query;
  Donor.list({ latMin, lonMin, latMax, lonMax, bloodGroupFilters, limit, skip }).then((donors) =>	res.json(donors))
    .error((e) => next(e));
}


/**
 * Delete donor.
 * @returns {donor}
 */
function remove(req, res, next) {
  const donor = req.donor;
  donor.removeAsync()
    .then((deletedDonor) => {res.json(deletedDonor); io.emit('DONOR_REMOVED', deletedDonor._id);})
    .error((e) => next(e));
}


export default { load, get, create, update, list, remove };
