import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Smartphone, QrCode } from 'lucide-react';

/**
 * XamanQRModal Component
 *
 * Displays a QR code for desktop users to scan with Xaman mobile app
 * or shows loading state for mobile users who are redirected to the app
 *
 * @param {boolean} open - Whether the modal is open
 * @param {function} onOpenChange - Callback when modal open state changes
 * @param {string} qrcode - QR code image URL
 * @param {string} title - Modal title
 * @param {string} description - Modal description
 * @param {boolean} isMobile - Whether user is on mobile device
 */
export default function XamanQRModal({
  open,
  onOpenChange,
  qrcode = '',
  title = 'Scan QR Code with Xaman',
  description = 'Use your Xaman wallet to sign the transaction.',
  isMobile = false,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-sm border-4 border-yellow-400">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-400 font-black text-xl" style={{ fontFamily: 'monospace' }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Smartphone className="w-6 h-6" />
            </motion.div>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {!isMobile && qrcode ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center p-4 bg-white rounded-lg border-4 border-yellow-400"
            >
              <img
                src={qrcode}
                alt="Xaman QR Code"
                className="max-w-64 max-h-64 w-full h-auto"
              />
            </motion.div>
          ) : !isMobile ? (
            <Card className="bg-black/60 border-2 border-cyan-500 w-full">
              <CardContent className="p-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="flex justify-center mb-4"
                >
                  <QrCode className="w-16 h-16 text-cyan-400" />
                </motion.div>
                <p className="text-cyan-400 text-center font-bold" style={{ fontFamily: 'monospace' }}>
                  GENERATING QR CODE...
                </p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="bg-black/40 border-2 border-blue-500 w-full">
            <CardContent className="p-4">
              <p className="text-blue-200 text-center text-sm font-bold" style={{ fontFamily: 'monospace' }}>
                {isMobile ? (
                  <>
                    <Smartphone className="w-5 h-5 inline-block mr-2" />
                    Opening Xaman app...
                  </>
                ) : (
                  description
                )}
              </p>
            </CardContent>
          </Card>

          {!isMobile && (
            <div className="text-center space-y-2">
              <p className="text-gray-300 text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                📱 Don't have Xaman?
              </p>
              <a
                href="https://xaman.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 underline text-xs font-bold"
                style={{ fontFamily: 'monospace' }}
              >
                Download Xaman Wallet
              </a>
            </div>
          )}

          <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-2 border-green-500 rounded p-3 w-full">
            <div className="flex items-start gap-2">
              <div className="text-green-400 text-lg">✅</div>
              <div className="flex-1">
                <p className="text-green-400 font-black text-xs mb-1" style={{ fontFamily: 'monospace' }}>
                  SECURE TRANSACTION
                </p>
                <p className="text-green-200 text-[10px] font-bold" style={{ fontFamily: 'monospace' }}>
                  Your transaction is signed securely in your Xaman wallet. We never have access to your private keys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
