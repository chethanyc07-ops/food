const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const { optionalProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', optionalProtect, DashboardController.getSummary);

module.exports = router;
