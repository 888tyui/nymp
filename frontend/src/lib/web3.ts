import { BrowserProvider, JsonRpcSigner } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
    phantom?: any;
    solana?: any;
  }
}

export type WalletType = 'metamask' | 'phantom' | 'coinbase';

export interface WalletOption {
  id: WalletType;
  name: string;
  icon: string;
  installed: boolean;
  downloadUrl: string;
}

export const getAvailableWallets = (): WalletOption[] => {
  return [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      installed: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask,
      downloadUrl: 'https://metamask.io/download/'
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      installed: typeof window !== 'undefined' && (typeof window.phantom !== 'undefined' || (window.ethereum?.isPhantom)),
      downloadUrl: 'https://phantom.app/download'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      installed: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet,
      downloadUrl: 'https://www.coinbase.com/wallet/downloads'
    }
  ];
};

export interface AuthenticatedWallet {
  address: string;
  signature: string;
  message: string;
  timestamp: number;
}

export const connectWallet = async (walletType: WalletType = 'metamask'): Promise<string | null> => {
  let provider: any;

  // Select provider based on wallet type
  switch (walletType) {
    case 'metamask':
      if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
        throw new Error('METAMASK_NOT_INSTALLED');
      }
      provider = window.ethereum;
      break;

    case 'phantom':
      if (window.ethereum?.isPhantom) {
        provider = window.ethereum;
      } else if (window.phantom?.ethereum) {
        provider = window.phantom.ethereum;
      } else {
        throw new Error('PHANTOM_NOT_INSTALLED');
      }
      break;

    case 'coinbase':
      if (typeof window.ethereum === 'undefined' || !window.ethereum.isCoinbaseWallet) {
        throw new Error('COINBASE_NOT_INSTALLED');
      }
      provider = window.ethereum;
      break;

    default:
      throw new Error('UNSUPPORTED_WALLET');
  }

  try {
    const browserProvider = new BrowserProvider(provider);
    
    // Request accounts
    const accounts = await browserProvider.send('eth_requestAccounts', []);
    
    if (accounts.length > 0) {
      // Automatically switch to Monad network after connection
      await switchToMonadNetwork(provider);
      return accounts[0];
    }
    return null;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return null;
  }
};

export const signMessage = async (address: string): Promise<AuthenticatedWallet | null> => {
  if (typeof window.ethereum === 'undefined') {
    return null;
  }

  try {
    const timestamp = Date.now();
    const message = `Welcome to nym - Monad Web3 App Builder

Sign this message to authenticate your wallet.

This request will not trigger any blockchain transaction or cost any gas fees.

Wallet Address: ${address}
Timestamp: ${timestamp}
Chain: Monad Mainnet (143)

By signing, you confirm you own this wallet.`;

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Request signature
    const signature = await signer.signMessage(message);
    
    return {
      address,
      signature,
      message,
      timestamp
    };
  } catch (error: any) {
    if (error.code === 4001) {
      // User rejected signature
      console.log('User rejected signature request');
    } else {
      console.error('Error signing message:', error);
    }
    return null;
  }
};

export const disconnectWallet = () => {
  // MetaMask doesn't have a disconnect method, but we can clear local state
  return true;
};

export const getConnectedWallet = async (): Promise<string | null> => {
  if (typeof window.ethereum === 'undefined') {
    return null;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_accounts', []);
    
    if (accounts.length > 0) {
      return accounts[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting connected wallet:', error);
    return null;
  }
};

export const switchToMonadNetwork = async (provider?: any) => {
  const ethereumProvider = provider || window.ethereum;
  
  if (typeof ethereumProvider === 'undefined') {
    return false;
  }

  try {
    // Monad Mainnet configuration
    const monadChainId = '0x8F'; // 143 in decimal
    const monadConfig = {
      chainId: monadChainId,
      chainName: 'Monad Mainnet',
      nativeCurrency: {
        name: 'Monad',
        symbol: 'MON',
        decimals: 18,
      },
      rpcUrls: [process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'https://rpc.monad.xyz'],
      blockExplorerUrls: ['https://monadvision.com'],
    };

    try {
      // Try to switch to the network
      await ethereumProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: monadChainId }],
      });
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to wallet
      if (switchError.code === 4902) {
        try {
          // Add the network
          await ethereumProvider.request({
            method: 'wallet_addEthereumChain',
            params: [monadConfig],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Monad network:', addError);
          return false;
        }
      }
      console.error('Error switching to Monad network:', switchError);
      return false;
    }
  } catch (error) {
    console.error('Error in switchToMonadNetwork:', error);
    return false;
  }
};

