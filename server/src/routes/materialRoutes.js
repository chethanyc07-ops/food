const express = require('express');
const { body } = require('express-validator');
const MaterialController = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/', protect, MaterialController.list);
router.get('/:id', protect, MaterialController.getById);

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Material name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('otrValue').isNumeric().withMessage('OTR value must be a number'),
    body('wvtrValue').isNumeric().withMessage('WVTR value must be a number'),
  ],
  validate,
  MaterialController.create
);

router.put(
  '/:id',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Material name cannot be empty'),
    body('otrValue').optional().isNumeric().withMessage('OTR value must be a number'),
    body('wvtrValue').optional().isNumeric().withMessage('WVTR value must be a number'),
  ],
  validate,
  MaterialController.update
);

router.delete('/:id', protect, MaterialController.delete);

module.exports = router;
