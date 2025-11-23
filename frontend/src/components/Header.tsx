'use client';

import { useStore } from '@/store/useStore';
import { connectWallet, disconnectWallet, getAvailableWallets, signMessage, type WalletType } from '@/lib/web3';
import { Save, Upload, Wallet, X, Shield, Twitter } from 'lucide-react';
import { filesApi, authApi } from '@/lib/api';
import { useState } from 'react';
import Modal from './Modal';
import { useModal } from '@/hooks/useModal';
import Image from 'next/image';

export default function Header() {
  const {
    currentWorkspace,
    walletAddress,
    isWalletConnected,
    setWalletAddress,
    setIsWalletConnected,
  } = useStore();

  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const modal = useModal();

  const handleConnectWallet = async (walletType?: WalletType) => {
    if (isWalletConnected) {
      disconnectWallet();
      setWalletAddress(null);
      setIsWalletConnected(false);
      localStorage.removeItem('nym_auth');
    } else {
      if (!walletType) {
        // Show wallet selection modal
        setShowWalletModal(true);
        return;
      }
      
      setIsAuthenticating(true);
      
      try {
        // Step 1: Connect wallet
        let address: string | null = null;
        
        try {
          address = await connectWallet(walletType);
        } catch (walletError: any) {
          setIsAuthenticating(false);
          
          if (walletError.message === 'METAMASK_NOT_INSTALLED') {
            modal.showModal({
              title: 'MetaMask Required',
              message: 'Please install MetaMask to use this feature.',
              type: 'warning',
              confirmText: 'Install MetaMask',
              onConfirm: () => window.open('https://metamask.io/download/', '_blank'),
            });
          } else if (walletError.message === 'PHANTOM_NOT_INSTALLED') {
            modal.showModal({
              title: 'Phantom Required',
              message: 'Please install Phantom Wallet to use this feature.',
              type: 'warning',
              confirmText: 'Install Phantom',
              onConfirm: () => window.open('https://phantom.app/download', '_blank'),
            });
          } else if (walletError.message === 'COINBASE_NOT_INSTALLED') {
            modal.showModal({
              title: 'Coinbase Wallet Required',
              message: 'Please install Coinbase Wallet to use this feature.',
              type: 'warning',
              confirmText: 'Install Coinbase',
              onConfirm: () => window.open('https://www.coinbase.com/wallet/downloads', '_blank'),
            });
          } else if (walletError.message === 'UNSUPPORTED_WALLET') {
            modal.showModal({
              title: 'Unsupported Wallet',
              message: 'This wallet type is not supported.',
              type: 'error',
            });
          } else {
            modal.showModal({
              title: 'Connection Error',
              message: 'Failed to connect wallet. Please try again.',
              type: 'error',
            });
          }
          return;
        }
        
        if (!address) {
          setIsAuthenticating(false);
          return;
        }

        // Step 2: Request signature
        const authData = await signMessage(address);
        if (!authData) {
          modal.showModal({
            title: 'Signature Required',
            message: 'Please sign the message to authenticate your wallet and continue.',
            type: 'warning',
          });
          setIsAuthenticating(false);
          return;
        }

        // Step 3: Verify signature on backend
        try {
          const verifyResponse = await authApi.verifySignature(authData);
          
          if (verifyResponse.data.success) {
            // Authentication successful
            setWalletAddress(address);
            setIsWalletConnected(true);
            setShowWalletModal(false);
            
            // Store authentication data
            localStorage.setItem('nym_auth', JSON.stringify({
              address,
              signature: authData.signature,
              timestamp: authData.timestamp
            }));
            
            modal.showModal({
              title: 'Success',
              message: 'Wallet authenticated successfully! You can now create and manage workspaces.',
              type: 'success',
            });
            
            console.log('✅ Wallet authenticated successfully');
          } else {
            modal.showModal({
              title: 'Authentication Failed',
              message: 'Could not verify your signature. Please try again.',
              type: 'error',
            });
          }
        } catch (verifyError) {
          console.error('Verification error:', verifyError);
          modal.showModal({
            title: 'Verification Error',
            message: 'Failed to verify signature. Please check your connection and try again.',
            type: 'error',
          });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        modal.showModal({
          title: 'Authentication Error',
          message: 'Something went wrong during authentication. Please try again.',
          type: 'error',
        });
      } finally {
        setIsAuthenticating(false);
      }
    }
  };

  const handleSave = async () => {
    if (!currentWorkspace) return;

    try {
      const response = await filesApi.export(currentWorkspace.id);
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentWorkspace.name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting workspace:', error);
      modal.showModal({
        title: 'Export Failed',
        message: 'Failed to export workspace. Please try again.',
        type: 'error',
      });
    }
  };

  const handleDeploy = () => {
    setShowDeployModal(true);
  };

  return (
    <>
      <header className="h-16 border-b border-gray-800 bg-black flex items-center justify-between px-6">
        <div className="flex items-center space-x-4 overflow-hidden">
          <div className="flex items-center space-x-2">
            <Image
              src="/nymlogotrs.png"
              alt="nym logo"
              width={40}
              height={40}
              className="rounded-full border border-gray-800 object-contain"
              priority
            />
            <h1 className="text-2xl font-bold text-primary tracking-tight">nym</h1>
          </div>
          {currentWorkspace && (
            <div className="text-sm text-gray-400">
              <span className="text-white">{currentWorkspace.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://x.com/nymdotfun"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-dark-bg hover:bg-gray-800 rounded-lg transition-colors"
            title="Follow us on X"
          >
            <Twitter size={18} />
            <span>@nymdotfun</span>
          </a>

          <button
            onClick={handleSave}
            disabled={!currentWorkspace}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-bg hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            <span>Save</span>
          </button>

          <button
            onClick={handleDeploy}
            disabled={!currentWorkspace}
            className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-purple-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={18} />
            <span>Deploy</span>
          </button>

          <button
            onClick={() => handleConnectWallet()}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-bg hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Wallet size={18} />
            <span>
              {isWalletConnected
                ? `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}`
                : 'Connect Wallet'}
            </span>
          </button>
        </div>
      </header>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-dark-bg border border-gray-800 rounded-lg p-8 max-w-md w-full mx-4 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Connect Wallet</h2>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Choose your wallet to connect to Monad Mainnet
            </p>
            <div className="mb-4 p-3 bg-primary bg-opacity-10 border border-primary rounded-lg flex items-start space-x-2">
              <Shield size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300">
                You&apos;ll be asked to sign a message to verify wallet ownership. This is free and doesn&apos;t cost gas.
              </p>
            </div>
            <div className="space-y-3">
              {getAvailableWallets().map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => wallet.installed ? handleConnectWallet(wallet.id) : window.open(wallet.downloadUrl, '_blank')}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-between p-4 bg-black hover:bg-gray-900 border border-gray-800 hover:border-primary rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{wallet.icon}</span>
                    <div className="text-left">
                      <p className="text-white font-medium">{wallet.name}</p>
                      <p className="text-xs text-gray-400">
                        {wallet.installed ? 'Detected' : 'Not installed'}
                      </p>
                    </div>
                  </div>
                  {!wallet.installed && (
                    <span className="text-xs text-primary">Install</span>
                  )}
                </button>
              ))}
            </div>
            {isAuthenticating && (
              <div className="mt-4 p-3 bg-dark-bg border border-gray-800 rounded-lg text-center">
                <p className="text-sm text-gray-300">🔐 Authenticating...</p>
                <p className="text-xs text-gray-400 mt-1">Please check your wallet for signature request</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-6 text-center">
              You will be prompted to switch to Monad Mainnet and sign a message
            </p>
          </div>
        </div>
      )}

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-dark-bg border border-gray-800 rounded-lg p-8 max-w-md w-full mx-4 animate-slide-up">
            <h2 className="text-2xl font-bold text-primary mb-4">Deploy</h2>
            <p className="text-gray-300 mb-6">
              Deployment feature is coming soon! We&apos;re working hard to bring you seamless deployment to production.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeployModal(false)}
                className="px-6 py-2 bg-primary hover:bg-purple-600 rounded-lg transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Common Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.hideModal}
        title={modal.config.title}
        message={modal.config.message}
        type={modal.config.type}
        confirmText={modal.config.confirmText}
        cancelText={modal.config.cancelText}
        onConfirm={modal.config.onConfirm}
        showCancel={modal.config.showCancel}
      />
    </>
  );
}

