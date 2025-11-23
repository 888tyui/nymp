# Monad Mainnet Network Configuration

## Official Network Details

### Network Information
- **Network Name**: Monad Mainnet
- **Chain ID**: 143 (0x8F in hexadecimal)
- **Currency Symbol**: MON
- **RPC URL**: https://rpc.monad.xyz
- **Block Explorer**: https://monadvision.com

---

## Automatic Network Addition

nym automatically adds and switches to Monad Mainnet when you connect your wallet.

### How It Works

1. Click **"Connect Wallet"** in the header
2. Select your wallet (MetaMask, Phantom, or Coinbase)
3. Approve the connection
4. **Automatic network switch** happens:
   - If Monad Mainnet is not in your wallet, it will be added
   - Your wallet will automatically switch to Monad Mainnet
   - You're ready to use nym on Monad! ✅

---

## Manual Network Addition

If you prefer to add Monad Mainnet manually:

### MetaMask / Coinbase Wallet

1. Open your wallet
2. Go to **Settings** → **Networks** → **Add Network**
3. Enter the following details:

```
Network Name: Monad Mainnet
RPC URL: https://rpc.monad.xyz
Chain ID: 143
Currency Symbol: MON
Block Explorer: https://monadvision.com
```

4. Click **Save**

### Phantom Wallet

1. Open Phantom
2. Click the hamburger menu (☰)
3. Go to **Settings** → **Developer Settings**
4. Enable **Testnet Mode** if needed
5. Add custom network with the details above

---

## Environment Variables

### Local Development

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MONAD_RPC_URL=https://rpc.monad.xyz
```

### Railway Deployment

Add these environment variables to your **Frontend Service**:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
NEXT_PUBLIC_MONAD_RPC_URL=https://rpc.monad.xyz
```

---

## Code Configuration

The network configuration is automatically handled in `frontend/src/lib/web3.ts`:

```typescript
const monadChainId = '0x8F'; // 143 in decimal
const monadConfig = {
  chainId: monadChainId,
  chainName: 'Monad Mainnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.monad.xyz'],
  blockExplorerUrls: ['https://monadvision.com'],
};
```

---

## Verification

### Check Your Network

After connecting, verify you're on Monad Mainnet:

1. Open your wallet
2. Check the network name at the top
3. Should show: **"Monad Mainnet"** or **"Chain 143"**

### Test Transaction

Try creating a workspace in nym:
- If successful, you're connected properly ✅
- Network info is stored with your workspace

---

## Troubleshooting

### Network Not Switching

If the automatic switch fails:
1. Check your wallet is unlocked
2. Look for a pending approval notification
3. Manually switch to Monad Mainnet in wallet settings

### RPC Connection Issues

If you can't connect to Monad RPC:
1. Check https://rpc.monad.xyz is accessible
2. Try refreshing the page
3. Reconnect your wallet

### Block Explorer Not Opening

The block explorer link should open https://monadvision.com
- Check your internet connection
- Try accessing the explorer directly

---

## Resources

- **Monad Official**: https://monad.xyz
- **Monad Documentation**: https://docs.monad.xyz
- **Monad Vision Explorer**: https://monadvision.com
- **RPC Endpoint**: https://rpc.monad.xyz

---

## For Developers

### Testing Network Connection

```typescript
import { switchToMonadNetwork } from '@/lib/web3';

// Test automatic switch
const success = await switchToMonadNetwork();
if (success) {
  console.log('✅ Connected to Monad Mainnet');
} else {
  console.log('❌ Failed to switch network');
}
```

### Getting Chain ID

```typescript
// Check current chain
const chainId = await window.ethereum.request({ 
  method: 'eth_chainId' 
});

console.log(chainId); // Should be "0x8f" for Monad
```

---

## Summary

| Property | Value |
|----------|-------|
| Network Name | Monad Mainnet |
| Chain ID | 143 (0x8F) |
| Symbol | MON |
| Decimals | 18 |
| RPC URL | https://rpc.monad.xyz |
| Explorer | https://monadvision.com |

**nym automatically handles all network configuration!** 🎉

Just connect your wallet and start building! 🚀


