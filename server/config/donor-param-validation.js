import Joi from 'joi';

export default {
  // POST /api/donors
  createDonor: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^(00|\+)([0-9]{2})[ ]?([0-9]{3})[ ]?([0-9]{4})[ ]?([0-9]{3})$/).required(),
      emailAddress: Joi.string().email().required(),
      bloodGroup: Joi.any().valid(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']).required(),
      ipAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      address: Joi.string().required()
    }
  },

  // UPDATE /api/donors/:donorId
  updateDonor: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^(00|\+)([0-9]{2})[ ]?([0-9]{3})[ ]?([0-9]{4})[ ]?([0-9]{3})$/).required(),
      emailAddress: Joi.string().email().required(),
      bloodGroup: Joi.any().valid(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']).required(),
      ipAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      address: Joi.string().required()
    },
    params: {
      donorId: Joi.string().hex().required()
    }
  }
};
