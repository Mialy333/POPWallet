import { useState, useCallback } from 'react';

const XAMAN_WEBSOCKET_TIMEOUT = 300000; // 5 minutes

const ERROR_MESSAGES = {
  WALLET_DISCONNECTED: 'Please connect your wallet first',
  FAILED_TO_SIGN_TX: 'Transaction signing was cancelled',
  TX_SIGNING_EXPIRED: 'Transaction signing request expired',
  INVALID_WALLET_TYPE: 'Invalid wallet type',
};

/**
 * Opens a deep link to Xaman app
 */
const openDeepLink = (url) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Checks if device is mobile
 */
const checkMobile = () => {
  return typeof window !== 'undefined' && window.innerWidth < 768;
};

/**
 * Custom hook for Xaman wallet integration
 */
export const useXaman = () => {
  const [qrcode, setQrcode] = useState('');
  const [jumpLink, setJumpLink] = useState('');
  const [xrpAddress, setXrpAddress] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('xrpl-address') || '';
    }
    return '';
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  /**
   * API Methods for calling backend endpoints
   */
  const xamanCreatePayload = async ({ transaction, options }) => {
    const response = await fetch('/api/wallets/xaman/createpayload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transaction, options }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payload');
    }

    return response.json();
  };

  const xamanGetPayload = async ({ payloadId }) => {
    const response = await fetch(
      `/api/wallets/xaman/getpayload?payloadId=${encodeURIComponent(payloadId)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get payload');
    }

    return response.json();
  };

  const xamanChecksign = async ({ hex }) => {
    const response = await fetch(
      `/api/wallets/xaman/checksign?hex=${encodeURIComponent(hex)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to verify signature');
    }

    return response.json();
  };

  /**
   * Connect to Xaman wallet
   */
  const connectXaman = useCallback(async () => {
    setIsConnecting(true);
    const isMobile = checkMobile();

    try {
      // Create return URL for current page
      const baseReturnUrl =
        typeof window !== 'undefined'
          ? window.location.href.split('?')[0]
          : '';

      const data = await xamanCreatePayload({
        transaction: {
          TransactionType: 'SignIn',
          SignIn: 'true',
        },
        options: {
          return_url: {
            app: `${baseReturnUrl}?xaman_payload={id}&journey=connect`,
            web: `${baseReturnUrl}?xaman_payload={id}&journey=connect`,
          },
        },
      });

      setQrcode(data.payload.refs.qr_png);
      setJumpLink(data.payload.next.always);

      if (isMobile) {
        openDeepLink(data.payload.next.always);
        setIsConnecting(false);
        return;
      }

      const ws = new WebSocket(data.payload.refs.websocket_status);

      const connectionTimeout = setTimeout(() => {
        console.warn('WebSocket connection timeout for Xaman connect');
        ws.close();
        setIsConnecting(false);
      }, XAMAN_WEBSOCKET_TIMEOUT);

      ws.onmessage = async (e) => {
        try {
          const responseObj = JSON.parse(e.data);
          if (
            responseObj.signed !== null &&
            responseObj.signed !== undefined
          ) {
            try {
              const payloadJson = await xamanGetPayload({
                payloadId: responseObj.payload_uuidv4,
              });

              if (
                payloadJson.payload?.response?.hex &&
                payloadJson.payload?.response?.account
              ) {
                const hex = payloadJson.payload.response.hex;
                await xamanChecksign({ hex });

                const address = payloadJson.payload.response.account;
                setXrpAddress(address);
                localStorage.setItem('xrpl-address', address);
                localStorage.setItem('xrpl-wallet', 'xaman');
              }
            } catch (error) {
              console.error('Error processing Xaman connect response', error);
            }

            clearTimeout(connectionTimeout);
            ws.close();
            setIsConnecting(false);
          }
        } catch (error) {
          console.error(
            'Error parsing WebSocket message for Xaman connect',
            error
          );
          clearTimeout(connectionTimeout);
          ws.close();
          setIsConnecting(false);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error for Xaman connect', error);
        clearTimeout(connectionTimeout);
        ws.close();
        setIsConnecting(false);
      };

      ws.onclose = () => {
        clearTimeout(connectionTimeout);
        setIsConnecting(false);
      };
    } catch (error) {
      console.error('Error connecting to Xaman:', error);
      setIsConnecting(false);
      throw error;
    }
  }, []);

  /**
   * Sign a transaction with Xaman
   */
  const signTransactionXaman = useCallback(
    async (transaction) => {
      setIsSigning(true);
      const isMobile = checkMobile();

      try {
        // Create return URL for current page
        const baseReturnUrl =
          typeof window !== 'undefined'
            ? window.location.href.split('?')[0]
            : '';

        const data = await xamanCreatePayload({
          transaction,
          options: {
            return_url: {
              app: `${baseReturnUrl}?xaman_payload={id}&journey=transaction`,
              web: `${baseReturnUrl}?xaman_payload={id}&journey=transaction`,
            },
          },
        });

        if (isMobile) {
          openDeepLink(data.payload.next.always);

          return new Promise((resolve, reject) => {
            const checkInterval = setInterval(async () => {
              try {
                const payloadJson = await xamanGetPayload({
                  payloadId: data.uuid,
                });

                if (payloadJson.payload.meta.signed) {
                  clearInterval(checkInterval);
                  setIsSigning(false);
                  resolve(payloadJson);
                } else if (
                  payloadJson.payload.meta.cancelled ||
                  payloadJson.payload.meta.expired
                ) {
                  clearInterval(checkInterval);
                  setIsSigning(false);
                  reject(
                    new Error(
                      payloadJson.payload.meta.cancelled
                        ? ERROR_MESSAGES.FAILED_TO_SIGN_TX
                        : ERROR_MESSAGES.TX_SIGNING_EXPIRED
                    )
                  );
                }
              } catch (error) {
                clearInterval(checkInterval);
                setIsSigning(false);
                reject(error);
              }
            }, 2000);

            setTimeout(() => {
              clearInterval(checkInterval);
              setIsSigning(false);
              reject(new Error(ERROR_MESSAGES.TX_SIGNING_EXPIRED));
            }, XAMAN_WEBSOCKET_TIMEOUT);
          });
        } else {
          setQrcode(data.payload.refs.qr_png);
          setJumpLink(data.payload.next.always);
        }

        const ws = new WebSocket(data.payload.refs.websocket_status);

        return new Promise((resolve, reject) => {
          const connectionTimeout = setTimeout(() => {
            console.warn(
              'WebSocket connection timeout for Xaman transaction signing'
            );
            ws.close();
            setIsSigning(false);
            reject(new Error(ERROR_MESSAGES.TX_SIGNING_EXPIRED));
          }, XAMAN_WEBSOCKET_TIMEOUT);

          ws.onmessage = async (e) => {
            try {
              const responseObj = JSON.parse(e.data);
              if (
                responseObj.signed !== null &&
                responseObj.signed !== undefined
              ) {
                try {
                  if (responseObj.signed) {
                    const signedTxJson = await xamanGetPayload({
                      payloadId: responseObj.payload_uuidv4,
                    });
                    clearTimeout(connectionTimeout);
                    ws.close();
                    setIsSigning(false);
                    resolve(signedTxJson);
                  } else {
                    clearTimeout(connectionTimeout);
                    ws.close();
                    setIsSigning(false);
                    reject(new Error(ERROR_MESSAGES.FAILED_TO_SIGN_TX));
                  }
                } catch (error) {
                  console.error(
                    'Error processing Xaman transaction response',
                    error
                  );
                  clearTimeout(connectionTimeout);
                  ws.close();
                  setIsSigning(false);
                  reject(error);
                }
              } else if (responseObj.expired) {
                clearTimeout(connectionTimeout);
                ws.close();
                setIsSigning(false);
                reject(new Error(ERROR_MESSAGES.TX_SIGNING_EXPIRED));
              }
            } catch (error) {
              console.error(
                'Error parsing WebSocket message for Xaman transaction',
                error
              );
              clearTimeout(connectionTimeout);
              ws.close();
              setIsSigning(false);
              reject(new Error('Failed to parse transaction response'));
            }
          };

          ws.onerror = (error) => {
            console.error('WebSocket error for Xaman transaction signing', error);
            clearTimeout(connectionTimeout);
            ws.close();
            setIsSigning(false);
            reject(new Error('WebSocket connection failed'));
          };

          ws.onclose = () => {
            clearTimeout(connectionTimeout);
          };
        });
      } catch (error) {
        console.error('Error signing transaction with Xaman:', error);
        setIsSigning(false);
        throw error;
      }
    },
    []
  );

  /**
   * Handle URL params after returning from Xaman mobile app
   */
  const handleXamanUrlParams = useCallback(async () => {
    if (typeof window === 'undefined') return { success: false };

    const urlParams = new URLSearchParams(window.location.search);
    const payloadId =
      urlParams.get('xaman_payload') ||
      urlParams.get('payloadId') ||
      urlParams.get('id');
    const journey = urlParams.get('journey') || 'connect';

    if (!payloadId) return { success: false };

    try {
      const payloadJson = await xamanGetPayload({ payloadId });

      if (
        payloadJson.payload.meta?.signed &&
        payloadJson.payload.response?.account
      ) {
        const hex = payloadJson.payload.response.hex;
        const txid = payloadJson.payload.response.txid;
        const account = payloadJson.payload.response.account;

        if (hex) {
          await xamanChecksign({ hex });
        }

        // Set the wallet connection data
        localStorage.setItem('xrpl-address', account);
        localStorage.setItem('xrpl-wallet', 'xaman');
        setXrpAddress(account);

        // Clean up URL parameters
        urlParams.delete('xaman_payload');
        urlParams.delete('payloadId');
        urlParams.delete('id');
        urlParams.delete('journey');
        const cleanUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        window.history.replaceState({}, '', cleanUrl);

        return { success: true, journey, txid, account };
      } else if (payloadJson.meta?.cancelled) {
        // Clean up URL parameters even on cancellation
        urlParams.delete('xaman_payload');
        urlParams.delete('payloadId');
        urlParams.delete('id');
        urlParams.delete('journey');
        const cleanUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        window.history.replaceState({}, '', cleanUrl);

        return { success: false, journey };
      }

      return { success: false, journey };
    } catch (error) {
      console.error('Error handling Xaman URL parameters', error);

      urlParams.delete('xaman_payload');
      urlParams.delete('payloadId');
      urlParams.delete('id');
      urlParams.delete('journey');
      const cleanUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      window.history.replaceState({}, '', cleanUrl);

      return { success: false, journey };
    }
  }, []);

  /**
   * Disconnect wallet
   */
  const disconnect = useCallback(() => {
    setXrpAddress('');
    localStorage.removeItem('xrpl-address');
    localStorage.removeItem('xrpl-wallet');
  }, []);

  return {
    qrcode,
    jumpLink,
    xrpAddress,
    isConnecting,
    isSigning,
    connectXaman,
    signTransactionXaman,
    handleXamanUrlParams,
    disconnect,
    checkMobile,
  };
};
