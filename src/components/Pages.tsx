import { motion } from 'framer-motion';
import { ArrowUpRight, Box, Check, Compass, Gamepad2, Heart, MessageCircle, Search, Send, Sparkles, Trophy, Wallet, Zap } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { events, signals, travelers } from '../data/demo';
import SignalCard from './SignalCard';
import Character from './Character';
import Portal from './Portal';
import PixelButton from './PixelButton';
import { BASE_SEPOLIA } from '../web3';
import { getStoredIdentity } from '../embeddedWallet';

const pageCopy: Record<string,string> = { Pulse:'THE LIVING STREAM OF THE UNIVERSE', Traverse:'SCAN THE WORLD AROUND YOU', Realms:'WORLDS WITH A PULSE', Districts:'PLACES WHERE THE UNIVERSE GATHERS', Nexuses:'COMMUNITIES WITH THEIR OWN WORLDS', Whispers:'PRIVATE TRANSMISSIONS', Notifications:'THE UNIVERSE NOTICED', Arcade:'PLAYABLE WORLDS · LIVE RUNS', Bazaar:'MANIFEST YOUR IDENTITY', Vault:'EVERYTHING YOU OWN', Character:'BECOME VISIBLE', Identity:'ONE IDENTITY · EVERY WORLD', Core:'YOUR UNIVERSE · SECURED', Companion:'YOUR COMPANION IS AWAKE' };

type Notify = (message:string)=>void;
type Props = { page:string; setPage:(p:string)=>void; notify?:Notify };

function WorldFrame({ children, kicker, title, action }:{children:ReactNode;kicker:string;title:string;action?:ReactNode}) {
 return <motion.section className="world-frame" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.35}}>
   <div className="world-frame-bg"/><div className="world-stars"/><div className="world-scan"/>
   <header className="page-head"><div><div className="eyebrow"><span/>{kicker}</div><h2>{title}</h2></div>{action}</header>
   <div className="world-content">{children}</div>
 </motion.section>;
}

export default function Pages({ page, setPage, notify = ()=>{} }: Props) {
 const title = pageCopy[page] ? page : 'Pulse';
 if(title==='Pulse') return <Pulse setPage={setPage} notify={notify}/>;
 if(title==='Traverse') return <Traverse setPage={setPage}/>;
 if(title==='Realms') return <Worlds type="realm" setPage={setPage}/>;
 if(title==='Districts') return <Worlds type="district" setPage={setPage}/>;
 if(title==='Nexuses') return <Worlds type="nexus" setPage={setPage}/>;
 if(title==='Whispers') return <Whispers notify={notify}/>;
 if(title==='Notifications') return <Notifications notify={notify}/>;
 if(title==='Arcade') return <Arcade notify={notify}/>;
 if(title==='Bazaar' ) return <Bazaar notify={notify}/>;
 if(title==='Vault') return <Vault/>;
 if(title==='Character') return <CharacterPage notify={notify}/>;
 if(title==='Identity') return <Identity notify={notify}/>;
 if(title==='Core') return <Core notify={notify}/>;
 return <Companion setPage={setPage}/>;
}

function Pulse({setPage,notify}:{setPage:(p:string)=>void;notify:Notify}) {
 const [resonated,setResonated]=useState(false);
 return <WorldFrame kicker="WORLD / PULSE" title="The universe is alive." action={<PixelButton onClick={()=>setPage('Traverse')} secondary><Search size={15}/> SCAN</PixelButton>}>
  <div className="pulse-command"><div className="scene-card realm-scene"><div className="scene-overlay"/><div className="scene-label"><span>YOUR REALM</span><b>ASTRAL HARBOR</b><small>ASCENSION 18 · ESSENCE 8,420</small><div className="progress"><i style={{width:'72%'}}/></div></div><div className="scene-portal"><Portal/><Character small/></div></div>
  <div className="event-stack">{events.map((e,i)=><motion.button whileHover={{x:5}} className={`event-card ${e.color}`} key={e.title} onClick={()=>notify(`${e.title} selected · ${e.when}`)}><span className="event-index">0{i+1}</span><div><small>{e.type}</small><b>{e.title}</b><span>{e.when}</span></div><ArrowUpRight size={17}/></motion.button>)}</div></div>
  <div className="section-title"><span>LIVE SIGNALS</span><small>UPDATING IN REAL TIME</small></div>
  {signals.map((s,i)=><div key={s.author} onDoubleClick={()=>{setResonated(true);notify(`Signal from ${s.author} resonated`)}}><SignalCard s={resonated && i===0 ? {...s,resonates:s.resonates+1}:s}/></div>)}
 </WorldFrame>;
}

function Traverse({setPage}:{setPage:(p:string)=>void}) {
 const [filter,setFilter]=useState('ALL');
 const visible=filter==='ALL'?travelers:travelers.filter(t=>filter==='TRAVELERS' || (filter==='REALMS' && t.level>=18) || (filter==='SIGNALS' && t.online));
 return <WorldFrame kicker="WORLD / TRAVERSE" title="Scan the universe." action={<div className="traverse-count">{visible.length.toString().padStart(2,'0')} FOUND</div>}>
  <div className="filter-row">{['ALL','REALMS','TRAVELERS','DISTRICTS','SIGNALS','EVENTS','ARCADE','NEXUSES'].map(x=><button className={filter===x?'on':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>
  <div className="traveler-grid">{visible.map((t,i)=><motion.button whileHover={{y:-6}} className="traveler-card" key={t.id} onClick={()=>setPage(t.name==='Luna'?'Whispers':'Identity')}><div className="traveler-card-scene" style={{backgroundPosition:`${20+i*14}% 42%`}}/><div className={`avatar xl ${t.hue}`}>{t.name[0]}</div><div className="traveler-card-copy"><b>{t.name}</b><span>{t.id}</span><small>ASCENSION {t.level} · {t.mood}</small></div><i className={t.online?'online':''}/><strong>{t.online?'ENTER ORBIT':'VIEW IDENTITY'}</strong></motion.button>)}</div>
 </WorldFrame>;
}

function Worlds({type,setPage}:{type:string;setPage:(p:string)=>void}) {
 const items=type==='realm'?['Astral Harbor','Moon Garden','Neon Shrine','Cloud District']:type==='district'?['Neon City','Music District','Art District','Gaming District']:['Night Owls','Pixel Architects','Realm Builders','Arcade Guild'];
 const target=type==='realm'?'Pulse':type==='district'?'Traverse':'Whispers';
 return <WorldFrame kicker={`WORLD / ${type.toUpperCase()}S`} title={type==='realm'?'Worlds with a pulse.':type==='district'?'Every district is a place.':'Find your people.'}>
  <div className="world-grid">{items.map((x,i)=><motion.button whileHover={{y:-6}} className="world-card" key={x} onClick={()=>setPage(target)}><div className="world-art" style={{backgroundPosition:`${i*29}% ${35+i*7}%`}}><span>0{i+1}</span><div className="world-art-glow"/></div><div className="world-card-copy"><small>{type.toUpperCase()} · {120+i*87} VISITORS</small><h3>{x}</h3><span>CONNECTED BY PORTAL</span><b>ENTER <ArrowUpRight size={13}/></b></div></motion.button>)}</div>
 </WorldFrame>;
}

function Whispers({notify}:{notify:Notify}) {
 const [active,setActive]=useState('Luna'); const [text,setText]=useState(''); const [threads,setThreads]=useState<Record<string,string[]>>({Luna:['You found the portal too?','I think it found me.','Then we should probably enter.'],Nova:['The floating gardens are alive.'],Kai:['Working on a new Realm tonight.'],Nyx:['Arcade run complete.'],Orion:['Meet me at Neon City.']});
 const messages=threads[active]||[]; const send=()=>{const value=text.trim();if(!value)return;setThreads(v=>({...v,[active]:[...(v[active]||[]),value]}));setText('');notify(`Whisper sent to ${active}`)};
 return <WorldFrame kicker="SOCIAL / WHISPERS" title="Private transmissions."><div className="chat-layout"><div className="chat-list">{travelers.slice(0,5).map(t=><button className={active===t.name?'selected':''} key={t.id} onClick={()=>setActive(t.name)}><span className={`avatar ${t.hue}`}>{t.name[0]}</span><div><b>{t.name}</b><small>{t.mood}</small></div><i className={t.online?'online':''}/></button>)}</div><div className="chat-window"><div className="chat-top"><span className="avatar cyan">{active[0]}</span><div><b>{active}</b><small>ONLINE · ASTRAL HARBOR</small></div><span className="signal-live">● LIVE</span></div><div className="chat-messages">{messages.map((m,i)=><motion.div initial={{opacity:0,x:i%2?8:-8}} animate={{opacity:1,x:0}} className={`bubble ${i%2?'mine':''}`} key={`${m}-${i}`}>{m}</motion.div>)}</div><div className="chat-input"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="TRANSMIT A WHISPER..."/><button onClick={send}><Send size={15}/></button></div></div></div></WorldFrame>;
}

function Notifications({notify}:{notify:Notify}) {
 const [read,setRead]=useState<number[]>([]); const notes=['Luna resonated with your Signal','Nova entered your Realm','Neon Storm is now live','You reached Ascension 18','Nyx sent you a Whisper'];
 const mark=(i:number)=>{setRead(v=>v.includes(i)?v:v.concat(i));notify('Notification marked as read')};
 return <WorldFrame kicker="SOCIAL / NOTIFICATIONS" title="The universe noticed."><div className="notice-toolbar"><span>{notes.length-read.length} UNREAD</span><button onClick={()=>setRead(notes.map((_,i)=>i))}>MARK ALL READ</button></div><div className="notice-list">{notes.map((x,i)=><motion.button whileHover={{x:5}} className={`notice ${read.includes(i)?'read':''}`} key={x} onClick={()=>mark(i)}><span className="notice-icon"><Sparkles size={16}/></span><div><b>{x}</b><small>{i+2}m AGO · WORLD EVENT</small></div><ArrowUpRight size={15}/></motion.button>)}</div></WorldFrame>;
}

function Arcade({notify}:{notify:Notify}) { const [running,setRunning]=useState(false);const [score,setScore]=useState(0);const play=()=>{setRunning(true);setScore(s=>s+120);notify('Arcade run started · +120 Essence')};return <WorldFrame kicker="UNIVERSE / ARCADE" title="Run the worlds."><div className="arcade-hero"><div><small>FEATURED RUN / 01</small><h3>PIXEL RUNNER</h3><p>Beat the skyline. Collect Essence. Chase the leaderboard.</p><PixelButton onClick={play}>{running?'RUNNING…':'START ARCADE RUN'} <Gamepad2 size={16}/></PixelButton>{running&&<div className="score-readout"><Trophy size={13}/> SCORE {score.toLocaleString()} · +120 ESSENCE</div>}</div><div className="runner-scene"><div className="runner-grid"/><motion.div animate={running?{x:[0,120,270,420]}:{x:0}} transition={{duration:1.8,repeat:running?Infinity:0}} className="runner-sprite">◆</motion.div><div className="runner-track"/></div></div><div className="game-grid">{['SNAKE','PONG','MEMORY','REACTION','MINI RPG','SPACE RUN'].map((x,i)=><motion.button whileHover={{y:-4}} className="game-card" key={x} onClick={play}><span>0{i+1}</span><h3>{x}</h3><small>ESSENCE · LEADERBOARD</small></motion.button>)}</div></WorldFrame> }

function Bazaar({notify}:{notify:Notify}) { const [owned,setOwned]=useState<string[]>(()=>JSON.parse(localStorage.getItem('lokyx-owned')||'[]'));const [rarity,setRarity]=useState('ALL');const items=['VOID RUNNER','ASTRAL CLOAK','PORTAL PET','NEON WINGS','COSMIC MASK','MOON RELIC'];const filtered=items.filter((_,i)=>rarity==='ALL'||(rarity==='RARE'&&i<4)||(rarity==='EPIC'&&i>=4));const acquire=(x:string)=>{const next=owned.includes(x)?owned.filter(a=>a!==x):owned.concat(x);setOwned(next);localStorage.setItem('lokyx-owned',JSON.stringify(next));notify(next.includes(x)?`${x} added to Vault`:`${x} released`)};return <WorldFrame kicker="UNIVERSE / BAZAAR" title="Manifest your identity."><div className="rarity-row">{['ALL','COMMON','RARE','EPIC','LEGENDARY','MYTHIC'].map(x=><button className={rarity===x?'on':''} onClick={()=>setRarity(x)} key={x}>{x}</button>)}</div><div className="item-grid">{filtered.map((x,i)=><motion.div whileHover={{y:-5}} className="item-card" key={x}><div className={`item-art i${i}`}><Box size={34}/><span>0{i+1}</span></div><div><small>{i>3?'EPIC':'RARE'}</small><b>{x}</b><span>{120+i*45} LYX</span></div><button className="buy-btn" onClick={()=>acquire(x)}>{owned.includes(x)?<><Check size={13}/> OWNED</>:'ACQUIRE'}</button></motion.div>)}</div></WorldFrame> }

function Vault(){const owned=useMemo(()=>JSON.parse(localStorage.getItem('lokyx-owned')||'[]') as string[],[]);const items=owned.length?owned:['MOON CLOAK','NEON PET','ASTRAL BADGE'];return <WorldFrame kicker="UNIVERSE / VAULT" title="Your manifestations."><div className="vault-layout"><div className="vault-character"><div className="vault-scene"><Character/></div><div><small>ACTIVE LOADOUT</small><h3>TRAVELER</h3><span>{items.length} ITEMS IN VAULT</span></div></div><div className="item-grid">{items.map((x,i)=><div className="item-card compact" key={`${x}-${i}`}><div className={`item-art i${i%6}`}><Box size={27}/></div><b>{x}</b><small>OWNED</small></div>)}</div></div></WorldFrame>}

function CharacterPage({notify}:{notify:Notify}){const [style,setStyle]=useState(()=>Number(localStorage.getItem('lokyx-character')||0));const looks=['VOID RUNNER','NEON WANDERER','ASTRAL GUARDIAN','NIGHT PIXEL'];const cycle=()=>setStyle(v=>(v+1)%looks.length);return <WorldFrame kicker="IDENTITY / CHARACTER LAB" title="Become visible."><div className="character-lab"><div className={`character-stage look-${style}`}><div className="stage-grid"/><div className="stage-copy"><small>ACTIVE MANIFESTATION</small><b>{looks[style]}</b></div><Character/></div><div className="custom-panel"><div className="custom-head"><span>MANIFESTATION</span><b>SYNC 98%</b></div>{['BODY','HAIR','EYES','CLOTHES','ACCESSORIES','AURA','PET','EMOTES'].map((x,i)=><button key={x} onClick={cycle}><span>{x}</span><i>{i===0?'ACTIVE':'CHANGE'}</i></button>)}<PixelButton onClick={()=>{setStyle(Math.floor(Math.random()*looks.length));notify('Character randomized')}}><Sparkles size={14}/> RANDOMIZE</PixelButton><PixelButton secondary onClick={()=>{localStorage.setItem('lokyx-character',String(style));notify('Character saved to Identity')}}>SAVE CHARACTER</PixelButton></div></div></WorldFrame>}

function Identity({notify}:{notify:Notify}){const [copied,setCopied]=useState(false);const identity=getStoredIdentity();const copy=()=>{if(identity?.address)navigator.clipboard?.writeText(identity.address);setCopied(true);notify('LOKYX wallet address copied');window.setTimeout(()=>setCopied(false),1200)};return <WorldFrame kicker="IDENTITY / LOKYX ID" title="One identity. Every world."><div className="identity-hero"><div className="identity-art"><Character small/></div><div className="identity-copy"><small>LOKYX ID</small><h3>@{identity?.username||'traveler'}</h3><p>{identity?.address||'Wallet not loaded'}</p><div className="identity-stats"><span><b>12</b>MILESTONES</span><span><b>46</b>SIGNALS</span><span><b>18</b>REALMS VISITED</span></div><button className="text-action" onClick={copy}>{copied?'COPIED':'COPY WALLET'}</button></div></div><div className="stats-grid">{['ESSENCE','REPUTATION','REALM LEVEL','ARCADE SCORE'].map((x,i)=><div className="stat-card" key={x}><small>{x}</small><b>{['8,420','7,240','18','42,910'][i]}</b><span>↗ {['+12%','+8%','+1','+14%'][i]}</span></div>)}</div></WorldFrame>}

function Core({notify}:{notify:Notify}){
 const identity=getStoredIdentity();
 const address=identity?.address || 'IDENTITY NOT LOADED';
 return <WorldFrame kicker="IDENTITY / CORE" title="Your universe, secured.">
  <div className="core-grid">
   <div className="wallet-card">
    <div className="wallet-orb"><Wallet size={26}/></div>
    <small>LOKYX EMBEDDED WALLET · SELF-CUSTODY</small>
    <h3>{address}</h3>
    <div className="balance">IDENTITY <span>ACTIVE</span></div>
    <div className="wallet-actions">
      <button onClick={()=>{navigator.clipboard?.writeText(address);notify('LOKYX wallet address copied')}}>COPY ADDRESS</button>
      <button onClick={()=>notify('Wallet is generated and secured inside LOKYX')}>WALLET STATUS</button>
      <button onClick={()=>notify('Recovery phrase is kept outside the LOKYX servers')}>RECOVERY</button>
    </div>
    <div className="score-readout"><Check size={12}/> BASE SEPOLIA READY · CHAIN {BASE_SEPOLIA.chainId}</div>
    <div className="core-note">Your LOKYX identity is the account. No external wallet connection is required.</div>
   </div>
   <div className="tx-card">
    <div className="section-title"><span>IDENTITY SYNC</span><small>WEB3 READY</small></div>
    {['IDENTITY OWNERSHIP','CHARACTER MANIFEST','REALM OBJECT','CREATOR REWARD'].map((x,i)=><div className="tx" key={x}><Zap size={14}/><span>{x}</span><b>{i<2?'READY':'PENDING'}</b></div>)}
    <div className="network-readout"><span>NETWORK</span><b>{BASE_SEPOLIA.name}</b><small>Chain ID {BASE_SEPOLIA.chainId} · Testnet</small></div>
   </div>
  </div>
 </WorldFrame>}

function Companion({setPage}:{setPage:(p:string)=>void}){const [reply,setReply]=useState('The portal is humming again.');const [input,setInput]=useState('');const answers=['You have 3 new Whispers, 2 Realm visitors and a World Event in Neon City.','Astral Harbor is quiet right now. Moon Garden is glowing.','Your next Directive is waiting in the Arcade.'];const speak=(text:string)=>setReply(text);return <WorldFrame kicker="COMPANION / IMPRINT" title="I'm awake."><div className="companion-page"><div className="companion-big"><div className="companion-face"><span/><span/><i/></div><div className="companion-orbit"/></div><div className="companion-copy"><small>PERSONALITY · WISE · ONLINE</small><h3>“{reply}”</h3><p>Your Companion knows your Realm, Pulse, progression and preferences. Ask for a summary, find a world, plan a quest or change your character.</p><div className="suggestions">{['SUMMARIZE MY PULSE','FIND AN EVENT','SUGGEST A QUEST'].map((x,i)=><button key={x} onClick={()=>speak(answers[i])}>{x}</button>)}<button onClick={()=>setPage('Character')}>CUSTOMIZE CHARACTER</button></div><div className="companion-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&setInput('') } placeholder="WHISPER TO YOUR COMPANION..."/><button onClick={()=>{if(input.trim())speak('I heard you. Let’s move.');setInput('')}}><ArrowUpRight size={17}/></button></div></div></div></WorldFrame>}
