const express = require('express');
const { body } = require('express-validator');
const RecommendationController = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('commodityId').notEmpty().withMessage('Commodity ID is required'),
    body('priorities').optional().isObject().withMessage('Priorities must be an object with protection, cost, and sustainability keys'),
  ],
  validate,
  RecommendationController.create
);

router.get('/', protect, RecommendationController.list);
router.get('/:id', protect, RecommendationController.getById);
router.delete('/:id', protect, RecommendationController.delete);

module.exports = router;
