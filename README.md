# LOKYX — Neon Awakening

LOKYX is a cinematic pixel-art Web3 social universe MVP: Travelers enter through a Portal, awaken a Character, receive a Realm, emit Signals, explore Districts, use Whispers, play Arcade Runs, collect Relics and interact with a Companion.

## What changed in this build

- Full-screen cinematic Gateway inspired by the supplied LOKYX visual target.
- High-resolution pixel-art direction with Press Start 2P / Silkscreen typography.
- Layered sky, fog, city, water, portal, character and HUD instead of a flat dashboard hero.
- Mouse parallax, portal pulse, stars, water movement, scanlines and subtle glitch motion.
- Functional ENTER LOKYX cinematic transition.
- Functional trailer / Features / Token / Roadmap / Docs overlays.
- Functional sound preference persistence.
- Functional Pulse, Traverse, Realms, Districts, Nexuses, Whispers, Notifications, Arcade, Bazaar, Vault, Character, Identity, Core and Companion screens.
- Demo interactions: Whisper sending, arcade score, item acquisition, character randomization/save, ID copy, Core sync.
- React/Vite configuration repaired: `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, automatic JSX transform.
- Asset slots are wired to `/public/assets` so generated art can be dropped in without changing component code.

## Install

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Asset slots

Put generated assets in `public/assets/` using the names below. Missing images automatically fall back to CSS atmosphere, so the app still boots.

### Gateway

- `gateway-sky.webp`
- `gateway-city-back.webp`
- `gateway-city-mid.webp`
- `gateway-fog.webp`

### World cards

- `astral-harbor.webp`
- `neon-city.webp`
- `arcade.webp`
- `relic-epic.webp`

### Character / future animation

- `traveler-idle.png`
- `character-idle.png`
- `character-walk.png`
- `character-run.png`
- `character-wave.png`
- `character-dance.png`
- `character-sit.png`
- `companion.png`

## Demo Mode

The MVP deliberately works without Supabase, an AI key or a live wallet connection. UI state is local/demo state and can later be replaced with real service adapters.

No real private keys, seed phrases or credentials are stored by this demo.

## Production architecture

The intended production stack is:

- React + Vite frontend
- Base / EVM for ownership where useful
- Supabase/Postgres + Realtime for off-chain social activity
- Secure wallet/key-management layer
- Server-side AI Companion integration
- Shared service contracts for web + mobile

Do not place server secrets in `VITE_` environment variables.

## GitHub

```bash
git init
git add .
git commit -m "Build LOKYX Neon Awakening MVP"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

## Important

The visual target depends heavily on the generated pixel-art assets. Keep those assets crisp, high-resolution and separated by layer. Do not flatten the gateway into one screenshot; the code intentionally keeps sky, fog, city, water, portal and character as independent layers so they can animate separately.

## Embedded Identity V1
The latest build uses an embedded self-custody wallet flow instead of external wallet connection. Users can create a wallet in-browser, receive a standard 12-word recovery phrase, unlock on the same device with a local passcode, or restore on another device using the phrase. See `EMBEDDED-IDENTITY-V1.md`.
