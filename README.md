# StockX 📈

**StockX** is a modern, real-time stock analysis dashboard built with the **MERN Stack** (MongoDB, Express, React, Node.js). It provides users with live market data, interactive charts, breaking news, and a personalized watchlist feature.

![StockX Dashboard](https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=3000&auto=format&fit=crop) *(Replace with actual screenshot)*

## 🚀 Features

-   **Real-Time Stock Data**: Live quotes, prices, and percentage changes powered by Yahoo Finance API.
-   **Interactive Charts**: Dynamic price history charts (1D, 1W, 1M, etc.) using `Recharts`.
-   **Market Movers**: Track top gainers and active stocks by sector (Technology, Financial, Services).
-   **Latest News**: aggregated news feed for specific stocks and general market headlines.
-   **Company Branding**: Automatic logo fetching for a polished UI.
-   **User Watchlist**: Save favorite stocks to your personal watchlist (requires account).
-   **Secure Authentication**: JWT-based Signup and Login system.
-   **Premium Dark UI**: Sleek, responsive dark mode design with glassmorphism effects.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Lucide Icons, Recharts, Vanilla CSS (Variables & Flexbox/Grid).
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Atlas).
-   **API**: Yahoo Finance 2 (`yahoo-finance2`), Clearbit/Google Favicons (Logos).

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
-   Node.js (v16+)
-   MongoDB Atlas URI (or local MongoDB)

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Adii1106/StockX.git
cd StockX
\`\`\`

### 2. Backward Setup (Server)
Navigate to the `server` directory and install dependencies.
\`\`\`bash
cd server
npm install
\`\`\`

Create a `.env` file in the `server` directory:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
\`\`\`

Start the server:
\`\`\`bash
npm run dev
\`\`\`
*Server runs on http://localhost:5000*

### 3. Frontend Setup (Client)
Open a new terminal, navigate to the `client` directory, and install dependencies.
\`\`\`bash
cd client
npm install
\`\`\`

Start the client:
\`\`\`bash
npm run dev
\`\`\`
*Client runs on http://localhost:5173*

## 📱 Usage

1.  **Register/Login**: Create an account to access the Watchlist feature.
2.  **Search**: Use the central search bar to find stocks (e.g., "AAPL", "TSLA").
3.  **Analyze**: View the price chart and key metrics.
4.  **Watchlist**: Click the "+" button to add a stock to your watchlist.
5.  **Market News**: Scroll down to see the latest headlines.

## 🤝 Contributing

Contributions are welcome!
1.  Fork the repo.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.


