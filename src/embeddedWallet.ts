import { Wallet } from 'ethers';
const STORAGE_KEY = 'lokyx-embedded-identity-v1';
const SESSION_KEY = 'lokyx-session-v1';
export type Identity = { username:string; address:string; createdAt:string; walletType:'lokyx-embedded' };
type StoredWallet = Identity & { encrypted:string; iv:string; salt:string };
const b64=(bytes:Uint8Array)=>{let s='';bytes.forEach(b=>s+=String.fromCharCode(b));return btoa(s)};
const bytes=(s:string)=>{const b=atob(s);return Uint8Array.from(b,c=>c.charCodeAt(0))};
async function key(secret:string,salt:Uint8Array){const m=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
export async function createEmbeddedWallet(username:string,passcode:string){
 const clean=username.trim(); if(!clean) throw Error('Choose a LOKYX username.'); if(passcode.length<8) throw Error('Use at least 8 characters for your wallet passcode.');
 const wallet=Wallet.createRandom(), phrase=wallet.mnemonic?.phrase; if(!phrase) throw Error('Wallet generation failed.');
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),k=await key(passcode,salt);
 const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,new TextEncoder().encode(phrase));
 const identity:Identity={username:clean,address:wallet.address,createdAt:new Date().toISOString(),walletType:'lokyx-embedded'};
 const stored:StoredWallet={...identity,encrypted:b64(new Uint8Array(encrypted)),iv:b64(iv),salt:b64(salt)};
 localStorage.setItem(STORAGE_KEY,JSON.stringify(stored)); sessionStorage.setItem(SESSION_KEY,JSON.stringify(identity)); return {identity,phrase};
}
export async function unlockEmbeddedWallet(passcode:string){
 const raw=localStorage.getItem(STORAGE_KEY); if(!raw) throw Error('No LOKYX wallet exists on this device.'); const s=JSON.parse(raw) as StoredWallet;
 try{const k=await key(passcode,bytes(s.salt));const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(s.iv)},k,bytes(s.encrypted));const phrase=new TextDecoder().decode(plain);const wallet=Wallet.fromPhrase(phrase);if(wallet.address.toLowerCase()!==s.address.toLowerCase())throw Error();const identity={username:s.username,address:s.address,createdAt:s.createdAt,walletType:s.walletType};sessionStorage.setItem(SESSION_KEY,JSON.stringify(identity));return {identity,phrase};}catch{throw Error('Incorrect passcode.')}
}
export async function restoreEmbeddedWallet(username:string, phrase:string, passcode:string){
 const clean=username.trim(); if(!clean) throw Error('Enter your LOKYX username.'); if(passcode.length<8) throw Error('Use at least 8 characters for your wallet passcode.');
 let wallet; try { wallet=Wallet.fromPhrase(phrase.trim().replace(/\s+/g,' ')); } catch { throw Error('Invalid 12-word recovery phrase.'); }
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),k=await key(passcode,salt);
 const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,new TextEncoder().encode(phrase.trim().replace(/\s+/g,' ')));
 const identity:Identity={username:clean,address:wallet.address,createdAt:new Date().toISOString(),walletType:'lokyx-embedded'};
 const stored:StoredWallet={...identity,encrypted:b64(new Uint8Array(encrypted)),iv:b64(iv),salt:b64(salt)};
 localStorage.setItem(STORAGE_KEY,JSON.stringify(stored)); sessionStorage.setItem(SESSION_KEY,JSON.stringify(identity)); return identity;
}

export function getStoredIdentity():Identity|null{const s=sessionStorage.getItem(SESSION_KEY);return s?JSON.parse(s):null}
export const hasWallet=()=>!!localStorage.getItem(STORAGE_KEY);
export const logoutEmbeddedWallet=()=>sessionStorage.removeItem(SESSION_KEY);
