import { AlertCircle } from 'lucide-react';

/**
 * Testnet Banner Component
 * Displays a prominent banner when the app is running on XRPL Testnet
 */
const TestnetBanner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>
          <strong>TESTNET MODE:</strong> This app is connected to the XRPL Testnet. No real funds are used.
        </span>
      </div>
    </div>
  );
};

export default TestnetBanner;
