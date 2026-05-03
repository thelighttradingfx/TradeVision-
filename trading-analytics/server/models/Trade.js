const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ['buy', 'sell'],
      required: [true, 'Trade type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.0001, 'Quantity must be positive'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    fee: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    executedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Virtual: total value of trade
tradeSchema.virtual('total').get(function () {
  return this.quantity * this.price;
});

tradeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Trade', tradeSchema);
