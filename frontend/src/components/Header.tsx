'use client';

import { useStore } from '@/store/useStore';
import { connectWallet, disconnectWallet } from '@/lib/web3';
import { Save, Upload, Wallet } from 'lucide-react';
import { filesApi } from '@/lib/api';
import { useState } from 'react';

export default function Header() {
  const {
    currentWorkspace,
    walletAddress,
    isWalletConnected,
    setWalletAddress,
    setIsWalletConnected,
  } = useStore();

  const [showDeployModal, setShowDeployModal] = useState(false);

  const handleConnectWallet = async () => {
    if (isWalletConnected) {
      disconnectWallet();
      setWalletAddress(null);
      setIsWalletConnected(false);
    } else {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
        setIsWalletConnected(true);
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
      alert('Failed to export workspace');
    }
  };

  const handleDeploy = () => {
    setShowDeployModal(true);
  };

  return (
    <>
      <header className="h-16 border-b border-gray-800 bg-black flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">nym</h1>
          {currentWorkspace && (
            <div className="text-sm text-gray-400">
              <span className="text-white">{currentWorkspace.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
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
            onClick={handleConnectWallet}
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

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-dark-bg border border-gray-800 rounded-lg p-8 max-w-md w-full mx-4 animate-slide-up">
            <h2 className="text-2xl font-bold text-primary mb-4">Deploy</h2>
            <p className="text-gray-300 mb-6">
              Deployment feature is coming soon! We're working hard to bring you seamless deployment to production.
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
    </>
  );
}

