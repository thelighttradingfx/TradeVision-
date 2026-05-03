import { useState, useEffect, useCallback } from 'react';
import { tradesService } from '../services/api';

export const useTrades = (filters = {}) => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchTrades = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await tradesService.getAll(filters);
      setTrades(data.trades);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trades');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchTrades(); }, [fetchTrades]);

  const addTrade = async (tradeData) => {
    const { data } = await tradesService.add(tradeData);
    setTrades((prev) => [data.trade, ...prev]);
    return data.trade;
  };

  const removeTrade = async (id) => {
    await tradesService.remove(id);
    setTrades((prev) => prev.filter((t) => t._id !== id));
  };

  return { trades, loading, error, pagination, addTrade, removeTrade, refetch: fetchTrades };
};
