import { XummSdk } from 'xumm-sdk';

const XUMM_KEY = process.env.XAMAN_KEY;
const XUMM_KEY_SECRET = process.env.XAMAN_KEY_SECRET;

/**
 * Vercel Serverless Function
 * GET /api/wallets/xaman/getpayload?payloadId=xxx
 * Retrieves the status of a Xaman payload
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

  // Only allow GET
  if (req.method !== 'GET') {
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

    const { payloadId } = req.query;

    if (!payloadId) {
      return res.status(400).json({
        error: 'payloadId is required'
      });
    }

    const xumm = new XummSdk(XUMM_KEY, XUMM_KEY_SECRET);
    const payload = await xumm.payload.get(payloadId);

    if (!payload) {
      return res.status(404).json({
        error: 'Payload not found'
      });
    }

    return res.status(200).json({ payload });
  } catch (error) {
    console.error('❌ Error getting Xaman payload:', error);
    return res.status(500).json({
      error: error.message || 'Failed to retrieve payload'
    });
  }
}
