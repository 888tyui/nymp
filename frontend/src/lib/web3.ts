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

export const connectWallet = async (walletType: WalletType = 'metamask'): Promise<string | null> => {
  let provider: any;

  // Select provider based on wallet type
  switch (walletType) {
    case 'metamask':
      if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
        alert('Please install MetaMask to use this feature');
        window.open('https://metamask.io/download/', '_blank');
        return null;
      }
      provider = window.ethereum;
      break;

    case 'phantom':
      if (window.ethereum?.isPhantom) {
        provider = window.ethereum;
      } else if (window.phantom?.ethereum) {
        provider = window.phantom.ethereum;
      } else {
        alert('Please install Phantom Wallet to use this feature');
        window.open('https://phantom.app/download', '_blank');
        return null;
      }
      break;

    case 'coinbase':
      if (typeof window.ethereum === 'undefined' || !window.ethereum.isCoinbaseWallet) {
        alert('Please install Coinbase Wallet to use this feature');
        window.open('https://www.coinbase.com/wallet/downloads', '_blank');
        return null;
      }
      provider = window.ethereum;
      break;

    default:
      alert('Unsupported wallet type');
      return null;
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
    // Note: Update these values with actual Monad Mainnet details when available
    const monadChainId = '0x3E7'; // Placeholder: 999 in decimal (update with actual chain ID)
    const monadConfig = {
      chainId: monadChainId,
      chainName: 'Monad Mainnet',
      nativeCurrency: {
        name: 'Monad',
        symbol: 'MONAD',
        decimals: 18,
      },
      rpcUrls: [process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'https://monad-rpc.placeholder'],
      blockExplorerUrls: ['https://monad-explorer.placeholder'],
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

