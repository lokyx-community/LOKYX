# LOKYX Embedded Identity V1

This build replaces the external-wallet-first flow with an embedded self-custody wallet flow.

## User flow
1. ENTER LOKYX
2. CREATE LOKYX IDENTITY
3. Choose username + local wallet passcode
4. Browser generates a real Ethereum wallet
5. A standard 12-word recovery phrase is shown once
6. User confirms the first recovery word
7. LOKYX Core opens with the wallet address
8. Returning users unlock with the local passcode
9. New-device users can restore from the 12-word phrase

## Security boundary
- The phrase is generated in the browser.
- The phrase is encrypted locally with AES-GCM using a PBKDF2-derived key.
- The raw phrase/private key is not sent to a LOKYX backend by this frontend.
- Do not add analytics, logging, crash reporting, or API calls that capture the phrase or private key.
- Do not put recovery phrases, private keys, or real-money secrets in GitHub or .env files.

## Web3 status
The UI is ready for Base Sepolia/testnet integration. Contract deployment and production wallet infrastructure are separate steps. Do not use this browser-local implementation for real funds until it has undergone a professional security review.

## Install
npm install
npm run dev
