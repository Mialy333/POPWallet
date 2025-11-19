import express from 'express';
import { XummSdk } from 'xumm-sdk';
import { verifySignature } from 'verify-xrpl-signature';
import jwt from 'jsonwebtoken';

const router = express.Router();

const XUMM_KEY = process.env.XAMAN_KEY;
const XUMM_KEY_SECRET = process.env.XAMAN_KEY_SECRET;
const ENC_KEY = process.env.ENC_KEY || 'your-secret-encryption-key-change-this';

// Validate environment variables
if (!XUMM_KEY || !XUMM_KEY_SECRET) {
  console.error('❌ XAMAN_KEY and XAMAN_KEY_SECRET must be set in .env file');
  process.exit(1);
}

/**
 * POST /api/wallets/xaman/createpayload
 * Creates a new Xaman payload for signing
 */
router.post('/createpayload', async (req, res) => {
  try {
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

    res.json({ payload });
  } catch (error) {
    console.error('❌ Error creating Xaman payload:', error);
    res.status(500).json({
      error: error.message || 'Failed to create payload'
    });
  }
});

/**
 * GET /api/wallets/xaman/getpayload?payloadId=xxx
 * Retrieves the status of a Xaman payload
 */
router.get('/getpayload', async (req, res) => {
  try {
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

    res.json({ payload });
  } catch (error) {
    console.error('❌ Error getting Xaman payload:', error);
    res.status(500).json({
      error: error.message || 'Failed to retrieve payload'
    });
  }
});

/**
 * GET /api/wallets/xaman/checksign?hex=xxx
 * Verifies the signature of a signed transaction
 */
router.get('/checksign', async (req, res) => {
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

      res.json({
        xrpAddress: resp.signedBy,
        token: encrypted
      });
    } else {
      res.status(400).json({
        error: 'Invalid signature'
      });
    }
  } catch (error) {
    console.error('❌ Error in checksign:', error);
    res.status(500).json({
      error: error.message || 'An error occurred'
    });
  }
});

export default router;
