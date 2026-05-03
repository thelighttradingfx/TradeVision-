const Trade = require('../models/Trade');

// @desc    Get portfolio summary (holdings)
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res, next) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ executedAt: 1 });

    // Build holdings map
    const holdings = {};
    for (const trade of trades) {
      if (!holdings[trade.symbol]) {
        holdings[trade.symbol] = { symbol: trade.symbol, quantity: 0, totalCost: 0, trades: 0 };
      }
      const h = holdings[trade.symbol];
      if (trade.type === 'buy') {
        h.quantity += trade.quantity;
        h.totalCost += trade.quantity * trade.price + trade.fee;
      } else {
        h.quantity -= trade.quantity;
        h.totalCost -= trade.quantity * trade.price - trade.fee;
      }
      h.trades += 1;
    }

    // Filter out fully closed positions
    const activeHoldings = Object.values(holdings)
      .filter((h) => h.quantity > 0.00001)
      .map((h) => ({
        ...h,
        avgCost: h.totalCost / h.quantity,
        quantity: parseFloat(h.quantity.toFixed(6)),
      }));

    const totalInvested = activeHoldings.reduce((sum, h) => sum + h.totalCost, 0);

    res.json({
      success: true,
      holdings: activeHoldings,
      summary: {
        totalPositions: activeHoldings.length,
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        totalTrades: trades.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get P&L over time
// @route   GET /api/portfolio/pnl
// @access  Private
const getPnL = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const from = new Date();
    from.setDate(from.getDate() - days);

    const trades = await Trade.find({
      user: req.user._id,
      executedAt: { $gte: from },
    }).sort({ executedAt: 1 });

    // Group by day
    const dailyMap = {};
    for (const trade of trades) {
      const day = trade.executedAt.toISOString().split('T')[0];
      if (!dailyMap[day]) dailyMap[day] = { date: day, pnl: 0, volume: 0 };
      const value = trade.quantity * trade.price;
      dailyMap[day].volume += value;
      dailyMap[day].pnl += trade.type === 'sell' ? value - trade.fee : -(value + trade.fee);
    }

    // Fill missing days
    const result = [];
    let cumPnl = 0;
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const entry = dailyMap[key] || { date: key, pnl: 0, volume: 0 };
      cumPnl += entry.pnl;
      result.push({ ...entry, cumulativePnl: parseFloat(cumPnl.toFixed(2)) });
    }

    res.json({ success: true, pnl: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPortfolio, getPnL };
