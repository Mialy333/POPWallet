import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the parent directory (project root)
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Load routes dynamically after env is set
async function startServer() {
  console.log('Loading .env from:', envPath);
  console.log('XAMAN_KEY:', process.env.XAMAN_KEY ? '✓ Set' : '✗ Not set');
  console.log('XAMAN_KEY_SECRET:', process.env.XAMAN_KEY_SECRET ? '✓ Set' : '✗ Not set');

  const { default: xamanRoutes } = await import('./routes/xaman.js');

  app.use('/api/wallets/xaman', xamanRoutes);

  app.listen(PORT, () => {
    console.log(`🚀 Xaman API server running on http://localhost:${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
