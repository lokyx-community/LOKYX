# LOKYX Web3 + Mobile V1

This build upgrades the functional LOKYX MVP without replacing its visual system.

## Web3 V1

- Base Sepolia wallet connection from **Identity → Core**.
- Automatic network check and Base Sepolia switch/add flow.
- Live wallet address and native ETH testnet balance.
- Demo mode remains available when no wallet is installed.
- No private keys or seed phrases are stored by the app.
- Contract directory includes a testnet-only `LOKYXToken.sol` shell.

### Environment

Copy `.env.example` to `.env` if you want to add public contract addresses later:

```env
VITE_NETWORK=base-sepolia
VITE_RPC_URL=https://sepolia.base.org
VITE_CONTRACT_TOKEN=
VITE_CONTRACT_CHARACTER=
VITE_CONTRACT_REALM=
```

Do not put private keys, seed phrases, server secrets or AI keys in `VITE_` variables.

## Mobile V1

- Existing responsive layouts retained.
- Mobile bottom navigation retained for the core five routes.
- Touch-sized wallet controls and responsive Core layout.
- PWA manifest and service worker included.
- Installable on supported mobile browsers as a home-screen app.

## Run

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm run preview
```

## What is still required for production

1. Deploy and audit the ownership contracts.
2. Add real contract addresses.
3. Add Supabase/Auth + Realtime for off-chain social state.
4. Add a server-side AI Companion endpoint.
5. Add transaction/contract adapters for Identity, Character, Realm and Bazaar.
6. Add Capacitor/React Native only if a store-distributed native app is needed; the V1 PWA is already mobile-oriented.
