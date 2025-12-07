import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { WalletState } from '@/types/betting';
import { COSTON2_CONFIG } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface WalletContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
  isLoading: boolean;
}

const defaultWalletState: WalletState = {
  isConnected: false,
  address: null,
  chainId: null,
  balance: '0',
  isCorrectNetwork: false,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>(defaultWalletState);
  const [isLoading, setIsLoading] = useState(false);

  const updateWalletState = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      if (accounts.length === 0) {
        setWallet(defaultWalletState);
        return;
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      const chainIdNumber = parseInt(chainId, 16);
      const isCorrectNetwork = chainIdNumber === COSTON2_CONFIG.chainId;

      let balance = '0';
      try {
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        }) as string;
        balance = (parseInt(balanceHex, 16) / 1e18).toFixed(4);
      } catch (e) {
        console.error('Failed to get balance:', e);
      }

      setWallet({
        isConnected: true,
        address: accounts[0],
        chainId: chainIdNumber,
        balance,
        isCorrectNetwork,
      });
    } catch (error) {
      console.error('Failed to update wallet state:', error);
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'MetaMask Required',
        description: 'Please install MetaMask to use this dApp.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await updateWalletState();
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to MetaMask!',
      });
    } catch (error: unknown) {
      const err = error as { code?: number };
      if (err.code === 4001) {
        toast({
          title: 'Connection Rejected',
          description: 'You rejected the connection request.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: 'Failed to connect to MetaMask.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [updateWalletState]);

  const disconnect = useCallback(() => {
    setWallet(defaultWalletState);
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    });
  }, []);

  const switchNetwork = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${COSTON2_CONFIG.chainId.toString(16)}` }],
      });
      await updateWalletState();
    } catch (switchError: unknown) {
      const err = switchError as { code?: number };
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${COSTON2_CONFIG.chainId.toString(16)}`,
                chainName: COSTON2_CONFIG.chainName,
                rpcUrls: [COSTON2_CONFIG.rpcUrl],
                nativeCurrency: COSTON2_CONFIG.nativeCurrency,
                blockExplorerUrls: [COSTON2_CONFIG.explorerUrl],
              },
            ],
          });
          await updateWalletState();
        } catch {
          toast({
            title: 'Network Error',
            description: 'Failed to add Coston2 network.',
            variant: 'destructive',
          });
        }
      }
    }
  }, [updateWalletState]);

  useEffect(() => {
    updateWalletState();

    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = () => updateWalletState();
      const handleChainChanged = () => updateWalletState();

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [updateWalletState]);

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect, switchNetwork, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
