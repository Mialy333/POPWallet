import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import xamanRoutes from './routes/xaman.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/wallets/xaman', xamanRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Xaman API server running on http://localhost:${PORT}`);
});
