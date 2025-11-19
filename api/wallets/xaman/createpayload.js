import { XummSdk } from 'xumm-sdk';

const XUMM_KEY = process.env.XAMAN_KEY;
const XUMM_KEY_SECRET = process.env.XAMAN_KEY_SECRET;

/**
 * Vercel Serverless Function
 * POST /api/wallets/xaman/createpayload
 * Creates a new Xaman payload for signing (TESTNET)
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables
    if (!XUMM_KEY || !XUMM_KEY_SECRET) {
      console.error('❌ XAMAN_KEY and XAMAN_KEY_SECRET must be set in Vercel environment variables');
      return res.status(500).json({
        error: 'Server configuration error: XAMAN credentials not configured'
      });
    }

    const { transaction, options } = req.body;

    if (!transaction) {
      return res.status(400).json({
        error: 'Transaction is required'
      });
    }

    if (!transaction.TransactionType) {
      return res.status(400).json({
        error: 'Transaction must have a TransactionType'
      });
    }

    const xumm = new XummSdk(XUMM_KEY, XUMM_KEY_SECRET);

    // Force testnet for all transactions
    const signInPayload = {
      txjson: transaction,
      options: {
        ...options,
        force_network: 'TESTNET' // Force testnet network
      }
    };

    const payload = await xumm.payload.create(signInPayload, true);

    if (payload) {
      console.log('✅ Xaman payload created (TESTNET):', payload.uuid);
    }

    return res.status(200).json({ payload });
  } catch (error) {
    console.error('❌ Error creating Xaman payload:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create payload'
    });
  }
}
