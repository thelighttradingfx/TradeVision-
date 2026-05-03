const express = require('express');
const { getPortfolio, getPnL } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getPortfolio);
router.get('/pnl', getPnL);

module.exports = router;
