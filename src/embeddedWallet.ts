import { Wallet } from 'ethers';

const STORAGE_KEY = 'lokyx-embedded-identity-v1';
const SESSION_KEY = 'lokyx-session-v1';

export type Identity = {
  username: string;
  address: string;
  createdAt: string;
  walletType: 'lokyx-embedded';
};

type StoredWallet = Identity & {
  encrypted: string;
  iv: string;
  salt: string;
};

function toBase64(value: Uint8Array): string {
  let output = '';

  for (const byte of value) {
    output += String.fromCharCode(byte);
  }

  return btoa(output);
}

function fromBase64(value: string): Uint8Array {
  const decoded = atob(value);
  const output = new Uint8Array(decoded.length);

  for (let i = 0; i < decoded.length; i += 1) {
    output[i] = decoded.charCodeAt(i);
  }

  return output;
}

function asArrayBuffer(value: Uint8Array): ArrayBuffer {
  return value.buffer.slice(
    value.byteOffset,
    value.byteOffset + value.byteLength,
  ) as ArrayBuffer;
}

async function deriveKey(
  secret: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const encodedSecret =
    new TextEncoder().encode(secret);

  const material =
    await crypto.subtle.importKey(
      'raw',
      asArrayBuffer(encodedSecret),
      'PBKDF2',
      false,
      ['deriveKey'],
    );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: asArrayBuffer(salt),
      iterations: 250_000,
      hash: 'SHA-256',
    },
    material,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  );
}

function normalizePhrase(
  phrase: string,
): string {
  return phrase
    .trim()
    .replace(/\s+/g, ' ');
}

function saveWallet(
  identity: Identity,
  encrypted: ArrayBuffer,
  iv: Uint8Array,
  salt: Uint8Array,
): void {
  const stored: StoredWallet = {
    ...identity,
    encrypted: toBase64(
      new Uint8Array(encrypted),
    ),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stored),
  );

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(identity),
  );
}

export async function createEmbeddedWallet(
  username: string,
  passcode: string,
) {
  const cleanUsername =
    username.trim();

  if (!cleanUsername) {
    throw new Error(
      'Choose a LOKYX username.',
    );
  }

  if (passcode.length < 8) {
    throw new Error(
      'Use at least 8 characters for your wallet passcode.',
    );
  }

  const wallet =
    Wallet.createRandom();

  const phrase =
    wallet.mnemonic?.phrase;

  if (!phrase) {
    throw new Error(
      'Wallet generation failed.',
    );
  }

  const normalizedPhrase =
    normalizePhrase(phrase);

  const salt =
    crypto.getRandomValues(
      new Uint8Array(16),
    );

  const iv =
    crypto.getRandomValues(
      new Uint8Array(12),
    );

  const encryptionKey =
    await deriveKey(
      passcode,
      salt,
    );

  const encodedPhrase =
    new TextEncoder().encode(
      normalizedPhrase,
    );

  const encrypted =
    await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: asArrayBuffer(iv),
      },
      encryptionKey,
      asArrayBuffer(encodedPhrase),
    );

  const identity: Identity = {
    username: cleanUsername,
    address: wallet.address,
    createdAt:
      new Date().toISOString(),
    walletType:
      'lokyx-embedded',
  };

  saveWallet(
    identity,
    encrypted,
    iv,
    salt,
  );

  return {
    identity,
    phrase: normalizedPhrase,
  };
}

export async function unlockEmbeddedWallet(
  passcode: string,
) {
  const raw =
    localStorage.getItem(
      STORAGE_KEY,
    );

  if (!raw) {
    throw new Error(
      'No LOKYX wallet exists on this device.',
    );
  }

  const stored =
    JSON.parse(raw) as StoredWallet;

  try {
    const encryptionKey =
      await deriveKey(
        passcode,
        fromBase64(
          stored.salt,
        ),
      );

    const encryptedData =
      fromBase64(
        stored.encrypted,
      );

    const plain =
      await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: asArrayBuffer(
            fromBase64(
              stored.iv,
            ),
          ),
        },
        encryptionKey,
        asArrayBuffer(
          encryptedData,
        ),
      );

    const phrase =
      new TextDecoder().decode(
        plain,
      );

    const wallet =
      Wallet.fromPhrase(
        phrase,
      );

    if (
      wallet.address.toLowerCase() !==
      stored.address.toLowerCase()
    ) {
      throw new Error(
        'Wallet verification failed.',
      );
    }

    const identity: Identity = {
      username:
        stored.username,
      address:
        stored.address,
      createdAt:
        stored.createdAt,
      walletType:
        stored.walletType,
    };

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify(identity),
    );

    return {
      identity,
      phrase,
    };
  } catch {
    throw new Error(
      'Incorrect passcode.',
    );
  }
}

export async function restoreEmbeddedWallet(
  username: string,
  phrase: string,
  passcode: string,
) {
  const cleanUsername =
    username.trim();

  const normalizedPhrase =
    normalizePhrase(
      phrase,
    );

  if (!cleanUsername) {
    throw new Error(
      'Enter your LOKYX username.',
    );
  }

  if (passcode.length < 8) {
    throw new Error(
      'Use at least 8 characters for your wallet passcode.',
    );
  }

  // Do NOT explicitly type this as Wallet.
  // ethers v6 returns an HDNodeWallet here.
  const wallet =
    Wallet.fromPhrase(
      normalizedPhrase,
    );

  if (!wallet) {
    throw new Error(
      'Invalid recovery phrase.',
    );
  }

  const salt =
    crypto.getRandomValues(
      new Uint8Array(16),
    );

  const iv =
    crypto.getRandomValues(
      new Uint8Array(12),
    );

  const encryptionKey =
    await deriveKey(
      passcode,
      salt,
    );

  const encodedPhrase =
    new TextEncoder().encode(
      normalizedPhrase,
    );

  const encrypted =
    await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: asArrayBuffer(iv),
      },
      encryptionKey,
      asArrayBuffer(
        encodedPhrase,
      ),
    );

  const identity: Identity = {
    username: cleanUsername,
    address: wallet.address,
    createdAt:
      new Date().toISOString(),
    walletType:
      'lokyx-embedded',
  };

  saveWallet(
    identity,
    encrypted,
    iv,
    salt,
  );

  return identity;
}

export function getStoredIdentity():
  | Identity
  | null {
  const stored =
    sessionStorage.getItem(
      SESSION_KEY,
    );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(
      stored,
    ) as Identity;
  } catch {
    sessionStorage.removeItem(
      SESSION_KEY,
    );

    return null;
  }
}

export function hasWallet(): boolean {
  return Boolean(
    localStorage.getItem(
      STORAGE_KEY,
    ),
  );
}

export function logoutEmbeddedWallet(): void {
  sessionStorage.removeItem(
    SESSION_KEY,
  );
}