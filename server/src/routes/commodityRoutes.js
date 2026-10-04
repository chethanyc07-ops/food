const express = require('express');
const { body } = require('express-validator');
const CommodityController = require('../controllers/commodityController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/', protect, CommodityController.list);
router.get('/:id', protect, CommodityController.getById);

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Commodity name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('baselineShelfLifeDays').isNumeric().withMessage('Baseline shelf life must be a number in days'),
  ],
  validate,
  CommodityController.create
);

router.put(
  '/:id',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Commodity name cannot be empty'),
    body('baselineShelfLifeDays').optional().isNumeric().withMessage('Baseline shelf life must be a number'),
  ],
  validate,
  CommodityController.update
);

router.delete('/:id', protect, CommodityController.delete);

module.exports = router;
