'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _donorParamValidation = require('../config/donor-param-validation');

var _donorParamValidation2 = _interopRequireDefault(_donorParamValidation);

var _donor = require('../controllers/donor');

var _donor2 = _interopRequireDefault(_donor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/donors - Get list of donors */
.get(_donor2.default.list)

/** POST /api/donors - Create new donor */
.post((0, _expressValidation2.default)(_donorParamValidation2.default.createDonor), _donor2.default.create);

router.route('/:donorId')
/** GET /api/donors/:donorId - Get donor */
.get(_donor2.default.get)

/** PUT /api/donors/:donorId - Update donor */
.put((0, _expressValidation2.default)(_donorParamValidation2.default.updateDonor), _donor2.default.update)

/** DELETE /api/donors/:donorId - Delete donor */
.delete(_donor2.default.remove);

/** Load donor when API with donorId route parameter is hit */
router.param('donorId', _donor2.default.load);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=donor.js.map
