const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true,
    },
    alertPrice: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate symbols per user
watchlistSchema.index({ user: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
