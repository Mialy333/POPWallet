import { verifySignature } from 'verify-xrpl-signature';
import jwt from 'jsonwebtoken';

const ENC_KEY = process.env.ENC_KEY || 'your-secret-encryption-key-change-this';

/**
 * Vercel Serverless Function
 * GET /api/wallets/xaman/checksign?hex=xxx
 * Verifies the signature of a signed transaction
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
    const { hex } = req.query;

    if (!hex) {
      return res.status(400).json({
        error: 'hex parameter is required'
      });
    }

    const decodedHex = decodeURIComponent(hex);
    const resp = verifySignature(decodedHex);

    if (resp.signatureValid) {
      const xrpAddress = resp.signedBy;
      const encrypted = jwt.sign({ address: xrpAddress }, ENC_KEY);

      console.log('✅ Signature verified for address:', xrpAddress);

      return res.status(200).json({
        xrpAddress: resp.signedBy,
        token: encrypted
      });
    } else {
      return res.status(400).json({
        error: 'Invalid signature'
      });
    }
  } catch (error) {
    console.error('❌ Error in checksign:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred'
    });
  }
}
