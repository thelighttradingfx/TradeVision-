const express = require('express');
const { body } = require('express-validator');
const { getTrades, addTrade, updateTrade, deleteTrade } = require('../controllers/tradeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getTrades);

router.post(
  '/',
  [
    body('symbol').trim().notEmpty().withMessage('Symbol is required'),
    body('type').isIn(['buy', 'sell']).withMessage('Type must be buy or sell'),
    body('quantity').isFloat({ min: 0.0001 }).withMessage('Quantity must be a positive number'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  addTrade
);

router.put('/:id', updateTrade);
router.delete('/:id', deleteTrade);

module.exports = router;
