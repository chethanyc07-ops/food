const express = require('express');
const { body } = require('express-validator');
const ComparisonController = require('../controllers/comparisonController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('commodityId').notEmpty().withMessage('Commodity ID is required'),
    body('materialIds').isArray({ min: 2, max: 4 }).withMessage('Must provide 2 to 4 material IDs to compare'),
  ],
  validate,
  ComparisonController.compare
);

module.exports = router;
