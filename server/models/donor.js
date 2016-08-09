import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Donor Schema
 */
const DonorSchema = new mongoose.Schema({
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
  latitude : {
      type: Number,
      required: true
  },
  longitude : {
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
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    'The value of path {PATH} ({VALUE}) is not a valid email address'],
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
DonorSchema.method({
});

/**
 * Statics
 */
DonorSchema.statics = {
  /**
   * Get donor
   * @param {ObjectId} id - The objectId of donor.
   * @returns {Promise<donor, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((donor) => {
        if (donor) {
          return donor;
        }
        const err = new APIError('No such donor exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List donors in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of donors to be skipped.
   * @param {number} limit - Limit number of donors to be returned.
   * @returns {Promise<donor[]>}
   */
  list({ latMin = -90, lonMin = -180, latMax = 90, lonMax = 180, bloodGroupFilters = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'], limit = 50, skip = 0 } = {}) {
    return this.where('bloodGroup').in(bloodGroupFilters)
      .where('latitude').gte(latMin).lte(latMax)
      .where('longitude').gte(lonMin).lte(lonMax)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .execAsync();
  }
};

/**
 * @typedef donor
 */
export default mongoose.model('Donor', DonorSchema);
