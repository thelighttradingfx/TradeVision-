# 📈 TradeVision — Trading Analytics SaaS Dashboard

A full-stack SaaS trading analytics platform built with React, Node.js, Express, and MongoDB. Includes JWT authentication, real-time portfolio tracking, trade history, P&L charts, and a clean responsive dashboard UI.

---

## 🚀 Features

- **JWT Authentication** — Secure register/login with protected routes
- **Portfolio Overview** — Track holdings, value, and asset allocation
- **Trade History** — Log and filter trades by asset, date, and type
- **P&L Analytics** — Visual profit/loss charts over time
- **Market Watchlist** — Monitor assets with live price simulation
- **Responsive UI** — Works on desktop and mobile
- **RESTful API** — Clean Express API with validation and error handling

---

## 🛠 Tech Stack

### Frontend
- React 18 + React Router v6
- Recharts (charts & analytics)
- Axios (API calls)
- TailwindCSS (styling)
- Context API (auth state)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- express-validator (input validation)
- dotenv, cors, helmet

---

## 📁 Project Structure

```
trading-analytics/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── auth/        # Login, Register forms
│   │   │   ├── dashboard/   # Portfolio, Stats cards
│   │   │   ├── charts/      # P&L, Allocation charts
│   │   │   └── layout/      # Navbar, Sidebar
│   │   ├── pages/           # Route-level pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # Auth context
│   │   ├── services/        # API service layer
│   │   └── utils/           # Helpers & formatters
│   └── package.json
├── server/                  # Node.js backend
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── models/              # Mongoose schemas
│   ├── middleware/          # Auth, error handling
│   └── config/              # DB connection
├── .env.example
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/trading-analytics.git
cd trading-analytics
```

### 2. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Install & run the backend
```bash
cd server
npm install
npm run dev
```

### 4. Install & run the frontend
```bash
cd client
npm install
npm start
```

The app will be available at `http://localhost:3000` and the API at `http://localhost:5000`.

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Trades
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trades` | Get all trades for user |
| POST | `/api/trades` | Add a new trade |
| PUT | `/api/trades/:id` | Update a trade |
| DELETE | `/api/trades/:id` | Delete a trade |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get portfolio summary |
| GET | `/api/portfolio/pnl` | Get P&L over time |

### Watchlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | Get user's watchlist |
| POST | `/api/watchlist` | Add asset to watchlist |
| DELETE | `/api/watchlist/:symbol` | Remove from watchlist |

---

## 🧪 Running Tests
```bash
cd server
npm test
```

---

## 📦 Deployment

- **Frontend**: Vercel or Netlify
- **Backend**: Railway, Render, or AWS EC2
- **Database**: MongoDB Atlas

---

## 👤 Author

**Ken** — Full-stack Developer  
Specializing in React, Node.js, and API-based SaaS systems.

---

## 📄 License

MIT
