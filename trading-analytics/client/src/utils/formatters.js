export const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);

export const formatNumber = (value, decimals = 2) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));

export const formatPercent = (value) =>
  `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

export const getPnLColor = (value) => (value >= 0 ? '#10b981' : '#ef4444');
