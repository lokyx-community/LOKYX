export const BASE_SEPOLIA = {
  chainId: 84532,
  hexChainId: '0x14a34',
  name: 'Base Sepolia',
  nativeSymbol: 'ETH',
  rpcUrl: 'https://sepolia.base.org',
  explorer: 'https://sepolia.basescan.org',
};

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
};

declare global {
  interface Window { ethereum?: Eip1193Provider }
}

export function getProvider() { return typeof window !== 'undefined' ? window.ethereum : undefined; }
export function shortAddress(address: string) { return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''; }
export function hexToDecimal(hex: string) { return Number.parseInt(hex, 16); }

export async function connectBaseSepolia() {
  const provider = getProvider();
  if (!provider) throw new Error('No browser wallet detected. Install a compatible EVM wallet to connect.');
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  await ensureBaseSepolia(provider);
  const address = accounts?.[0] as string | undefined;
  if (!address) throw new Error('Wallet did not return an account.');
  const balanceHex = await provider.request({ method: 'eth_getBalance', params: [address, 'latest'] });
  return { address, balanceWei: BigInt(balanceHex), balanceEth: Number(BigInt(balanceHex)) / 1e18 };
}

export async function ensureBaseSepolia(provider = getProvider()) {
  if (!provider) throw new Error('No browser wallet detected.');
  const current = await provider.request({ method: 'eth_chainId' });
  if (String(current).toLowerCase() === BASE_SEPOLIA.hexChainId) return;
  try {
    await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BASE_SEPOLIA.hexChainId }] });
  } catch (error: any) {
    if (error?.code !== 4902) throw error;
    await provider.request({ method: 'wallet_addEthereumChain', params: [{
      chainId: BASE_SEPOLIA.hexChainId,
      chainName: BASE_SEPOLIA.name,
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: [BASE_SEPOLIA.rpcUrl],
      blockExplorerUrls: [BASE_SEPOLIA.explorer],
    }] });
  }
}

export async function getWalletState() {
  const provider = getProvider();
  if (!provider) return null;
  const accounts = await provider.request({ method: 'eth_accounts' });
  const chainId = await provider.request({ method: 'eth_chainId' });
  if (!accounts?.[0]) return { address: '', chainId: hexToDecimal(chainId), connected: false };
  const balanceHex = await provider.request({ method: 'eth_getBalance', params: [accounts[0], 'latest'] });
  return { address: accounts[0], chainId: hexToDecimal(chainId), connected: true, balanceWei: BigInt(balanceHex), balanceEth: Number(BigInt(balanceHex)) / 1e18 };
}
