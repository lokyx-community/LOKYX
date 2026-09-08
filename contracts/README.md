# LOKYX Web3 V1 contracts

V1 targets **Base Sepolia** for safe development and demo testing (chain ID `84532`).

## Planned ownership layer

- `LOKYXToken.sol` — ERC-20 utility token shell (`LYX`).
- Identity — one LOKYX identity owned by an address.
- Character — character manifestation ownership.
- Realm — realm ownership / access records.
- Collectibles — relics, badges and other owned objects.
- Marketplace — Bazaar listings and purchases.

Pulse, Whispers, notifications, presence, AI conversations and other high-frequency social data should stay off-chain in V1.

## Deployment

This repository intentionally does **not** contain a private key, seed phrase or deployed production address. Deploy contracts from your own secure development wallet/tooling, then put only public contract addresses into frontend environment variables.

The frontend currently connects directly to Base Sepolia through an injected EIP-1193 wallet and keeps a demo mode when no wallet is available.
