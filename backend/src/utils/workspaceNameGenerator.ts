// Generate a meaningful workspace name from user message
export function generateWorkspaceName(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // DeFi related
  if (lowerMessage.includes('swap') || lowerMessage.includes('dex')) {
    return '🔄 Token Swap DApp';
  }
  if (lowerMessage.includes('stake') || lowerMessage.includes('staking')) {
    return '💎 Staking Platform';
  }
  if (lowerMessage.includes('farm') || lowerMessage.includes('yield')) {
    return '🌾 Yield Farming DApp';
  }
  if (lowerMessage.includes('lending') || lowerMessage.includes('borrow')) {
    return '💰 Lending Protocol';
  }
  if (lowerMessage.includes('dao') || lowerMessage.includes('governance')) {
    return '🏛️ DAO Platform';
  }
  
  // NFT related
  if (lowerMessage.includes('nft') && (lowerMessage.includes('market') || lowerMessage.includes('marketplace'))) {
    return '🎨 NFT Marketplace';
  }
  if (lowerMessage.includes('nft') && (lowerMessage.includes('mint') || lowerMessage.includes('minting'))) {
    return '✨ NFT Minting DApp';
  }
  if (lowerMessage.includes('nft') && (lowerMessage.includes('gallery') || lowerMessage.includes('collection'))) {
    return '🖼️ NFT Gallery';
  }
  if (lowerMessage.includes('nft')) {
    return '🎯 NFT Platform';
  }
  
  // Token related
  if (lowerMessage.includes('token') && lowerMessage.includes('dashboard')) {
    return '📊 Token Dashboard';
  }
  if (lowerMessage.includes('token') && (lowerMessage.includes('transfer') || lowerMessage.includes('send'))) {
    return '💸 Token Transfer App';
  }
  if (lowerMessage.includes('balance') || lowerMessage.includes('wallet dashboard')) {
    return '💳 Wallet Dashboard';
  }
  
  // General Web3
  if (lowerMessage.includes('wallet') && lowerMessage.includes('connect')) {
    return '🔗 Wallet Connect App';
  }
  if (lowerMessage.includes('dapp') || lowerMessage.includes('web3 app')) {
    return '⚡ Web3 DApp';
  }
  if (lowerMessage.includes('game') || lowerMessage.includes('gaming')) {
    return '🎮 Web3 Game';
  }
  
  // Landing pages / Portfolio
  if (lowerMessage.includes('landing') || lowerMessage.includes('homepage')) {
    return '🌐 Landing Page';
  }
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('profile')) {
    return '👤 Portfolio Site';
  }
  
  // Default based on first few words
  const words = message.split(' ').slice(0, 3).join(' ');
  const truncated = words.length > 25 ? words.substring(0, 25) + '...' : words;
  return `🚀 ${truncated}`;
}

