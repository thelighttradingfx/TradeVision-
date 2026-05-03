const Watchlist = require('../models/Watchlist');

// @desc    Get watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, watchlist: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res, next) => {
  try {
    const { symbol, name, alertPrice } = req.body;
    const item = await Watchlist.create({ user: req.user._id, symbol, name, alertPrice });
    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from watchlist
// @route   DELETE /api/watchlist/:symbol
// @access  Private
const removeFromWatchlist = async (req, res, next) => {
  try {
    const item = await Watchlist.findOneAndDelete({
      user: req.user._id,
      symbol: req.params.symbol.toUpperCase(),
    });

    if (!item) return res.status(404).json({ success: false, message: 'Symbol not in watchlist' });
    res.json({ success: true, message: `${req.params.symbol} removed from watchlist` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
