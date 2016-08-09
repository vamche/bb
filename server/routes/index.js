import express from 'express';
import donorRoutes from './donor';

const router = express.Router();	// eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount donor routes at /donors
router.use('/donors', donorRoutes);

export default router;
