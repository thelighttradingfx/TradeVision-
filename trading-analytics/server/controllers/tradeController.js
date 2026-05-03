const { validationResult } = require('express-validator');
const Trade = require('../models/Trade');

// @desc    Get all trades for user
// @route   GET /api/trades
// @access  Private
const getTrades = async (req, res, next) => {
  try {
    const { symbol, type, from, to, page = 1, limit = 20 } = req.query;
    const filter = { user: req.user._id };

    if (symbol) filter.symbol = symbol.toUpperCase();
    if (type) filter.type = type;
    if (from || to) {
      filter.executedAt = {};
      if (from) filter.executedAt.$gte = new Date(from);
      if (to) filter.executedAt.$lte = new Date(to);
    }

    const total = await Trade.countDocuments(filter);
    const trades = await Trade.find(filter)
      .sort({ executedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: trades.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      trades,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add trade
// @route   POST /api/trades
// @access  Private
const addTrade = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const trade = await Trade.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, trade });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trade
// @route   PUT /api/trades/:id
// @access  Private
const updateTrade = async (req, res, next) => {
  try {
    let trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ success: false, message: 'Trade not found' });
    if (trade.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    trade = await Trade.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, trade });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trade
// @route   DELETE /api/trades/:id
// @access  Private
const deleteTrade = async (req, res, next) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ success: false, message: 'Trade not found' });
    if (trade.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await trade.deleteOne();
    res.json({ success: true, message: 'Trade removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTrades, addTrade, updateTrade, deleteTrade };
