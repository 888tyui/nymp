import { BrowserProvider, JsonRpcSigner } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async (): Promise<string | null> => {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask to use this feature');
    return null;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length > 0) {
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

export const switchToMonadNetwork = async () => {
  if (typeof window.ethereum === 'undefined') {
    return false;
  }

  try {
    // Monad Mainnet configuration (update with actual values when available)
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x...', // Monad chain ID (to be updated)
          chainName: 'Monad Mainnet',
          nativeCurrency: {
            name: 'MONAD',
            symbol: 'MONAD',
            decimals: 18,
          },
          rpcUrls: [process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'https://monad-rpc-url'],
          blockExplorerUrls: ['https://monad-explorer-url'],
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Error switching to Monad network:', error);
    return false;
  }
};

