import express from 'express';
import validate from 'express-validation';
import paramValidation from '../config/donor-param-validation';
import donorCtrl from '../controllers/donor';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** GET /api/donors - Get list of donors */
  .get(donorCtrl.list)

  /** POST /api/donors - Create new donor */
  .post(validate(paramValidation.createDonor), donorCtrl.create);

router.route('/:donorId')
  /** GET /api/donors/:donorId - Get donor */
  .get(donorCtrl.get)

  /** PUT /api/donors/:donorId - Update donor */
  .put(validate(paramValidation.updateDonor), donorCtrl.update)

  /** DELETE /api/donors/:donorId - Delete donor */
  .delete(donorCtrl.remove);

/** Load donor when API with donorId route parameter is hit */
router.param('donorId', donorCtrl.load);

export default router;
