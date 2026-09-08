import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Character from './Character';
import Portal from './Portal';
import StarField from './StarField';

type Panel = 'features' | 'token' | 'roadmap' | 'docs' | 'trailer' | null;

const panels: Record<Exclude<Panel, null>, { title: string; eyebrow: string; items: string[] }> = {
  features: { eyebrow: 'SYSTEM / FEATURES', title: 'A universe you can actually enter.', items: ['Identity becomes a playable character.', 'Realms are persistent personal worlds.', 'Traverse connects people, places and events.', 'Pulse turns activity into living signals.', 'Arcade and Bazaar add playable progression.', 'Companion keeps the universe responsive.'] },
  token: { eyebrow: 'ECONOMY / LYX', title: 'A utility layer beneath the world.', items: ['LYX powers in-world utility.', 'Creator rewards can flow through the economy.', 'Realm customization can consume utility.', 'Events can unlock token-gated experiences.', 'Base / EVM architecture is demo-ready.', 'On-chain actions remain abstracted for the player.'] },
  roadmap: { eyebrow: 'CHRONICLE / ROADMAP', title: 'From one gateway to an open universe.', items: ['01 · NEON AWAKENING', '02 · REALM EXPANSION', '03 · NEXUS RISE', '04 · PORTAL NETWORK', '05 · LOKYX MOBILE', '06 · OPEN UNIVERSE'] },
  docs: { eyebrow: 'ARCHIVE / DOCS', title: 'The architecture behind the illusion.', items: ['Identity + wallet creation', 'Realm and object model', 'Social signals and Whispers', 'Demo-first service boundaries', 'Base / EVM integration layer', 'AI Companion interface'] },
  trailer: { eyebrow: 'TRANSMISSION / TRAILER', title: 'The gateway is only the beginning.', items: ['A living social universe.', 'A character that represents you.', 'Worlds connected by portals.', 'Signals, Whispers and events.', 'Playable progression.', 'An AI Companion that knows the world.'] },
};

export default function Gateway({ enter }: { enter: () => void }) {
  const [muted, setMuted] = useState(() => localStorage.getItem('lokyx-muted') !== 'false');
  const [panel, setPanel] = useState<Panel>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => localStorage.setItem('lokyx-muted', String(muted)), [muted]);

  return (
    <div className="gateway" onPointerMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      setPointer({ x: (e.clientX - r.left - r.width / 2) / r.width, y: (e.clientY - r.top - r.height / 2) / r.height });
    }} onPointerLeave={() => setPointer({ x: 0, y: 0 })}>
      <motion.div className="gateway-scene" animate={{ x: pointer.x * -10, y: pointer.y * -6 }} transition={{ type: 'spring', stiffness: 45, damping: 22 }}>
        <img className="gateway-background" src="/assets/gateway-background.webp" alt="LOKYX futuristic city" draggable={false} />
        <div className="scene-color-grade" />
        <div className="scene-depth" />
      </motion.div>
      <StarField />
      <div className="pixel-grid-overlay" />
      <div className="gateway-vignette" />
      <div className="crt-lines" />

      <header className="landing-nav">
        <button className="landing-brand" onClick={() => setPanel(null)}>
          <span className="brand-pixel-core">◆</span><span className="brand-word">LOKYX</span>
        </button>
        <nav>
          <button onClick={() => setPanel(null)}>EXPLORE</button>
          <button onClick={() => setPanel('features')}>FEATURES</button>
          <button onClick={() => setPanel('token')}>TOKEN</button>
          <button onClick={() => setPanel('roadmap')}>ROADMAP</button>
          <button onClick={() => setPanel('docs')}>DOCS</button>
        </nav>
        <div className="landing-tools">
          <button className="icon-tool" onClick={() => setMuted(v => !v)}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
          <span className="nav-divider" />
          <button className="header-enter" onClick={enter}><span /> ENTER LOKYX <ArrowRight size={13} /></button>
        </div>
      </header>

      <main className="gateway-main">
        <motion.section className="hero-copy" animate={{ x: pointer.x * -7, y: pointer.y * -4 }} transition={{ type: 'spring', stiffness: 45, damping: 22 }}>
          <div className="pixel-eyebrow"><i /> THE NEXT-GEN WEB3 SOCIAL UNIVERSE <i /></div>
          <div className="hero-logo" aria-label="LOKYX"><span>L</span><span>O</span><span className="logo-diamond">◆</span><span>K</span><span>Y</span><span>X</span></div>
          <div className="hero-tagline">OWN YOUR IDENTITY.<br />BUILD YOUR WORLD.<br />CONNECT WITHOUT BORDERS.</div>
          <div className="hero-actions">
            <motion.button className="hero-enter" onClick={enter} whileHover={{ y: -2 }} whileTap={{ scale: .98 }}>ENTER LOKYX <ArrowRight size={16} /></motion.button>
            <button className="hero-trailer" onClick={() => setPanel('trailer')}><Play size={13} fill="currentColor" /> WATCH TRAILER</button>
          </div>
          <div className="hero-rule"><span /> IDENTITY // WORLD // SOCIAL // PLAY <span /></div>
        </motion.section>

        <motion.section className="portal-stage" animate={{ x: pointer.x * -14, y: pointer.y * -8 }} transition={{ type: 'spring', stiffness: 40, damping: 22 }}>
          <div className="portal-beam" />
          <div className="portal-halo" />
          <Portal />
          <Character />
          <div className="portal-readout"><span>GATEWAY // 001</span><b><i /> PORTAL ACTIVE</b></div>
        </motion.section>

        <div className="live-counter"><span className="live-dot" /><b>LIVE</b><span>298,742 EXPLORERS</span></div>

        <div className="gateway-dock">
          {[
            ['REALMS','BUILD YOUR OWN WORLD','0% 36%'],
            ['DISTRICTS','EXPLORE UNIQUE WORLDS','50% 44%'],
            ['GAMES','PLAY & EARN REWARDS','77% 48%'],
            ['BAZAAR','OWN RARE DIGITAL RELICS','100% 40%']
          ].map(([title,sub,pos], i) => <button className="dock-card" key={title} onClick={i===0 ? enter : () => setPanel(i===3 ? 'token' : 'features')}>
            <div className="dock-art" style={{ backgroundPosition: pos }}><span>{String(i + 1).padStart(2,'0')}</span></div>
            <div className="dock-copy"><strong>{title}</strong><small>{sub}</small></div><ArrowRight size={14} />
          </button>)}
        </div>
      </main>

      <div className="gateway-status"><span>LOKYX NETWORK <b>ONLINE</b></span><span>SEASON 01 · NEON AWAKENING</span><span>BASE // DEMO MODE</span></div>

      <AnimatePresence>
        {panel && <motion.div className="gateway-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(null)}>
          <motion.div className="gateway-modal-card" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPanel(null)}><X size={17} /></button>
            {panel === 'trailer' && <div className="trailer-art"><img src="/assets/gateway-portal.png" alt=""/><div><span>TRANSMISSION</span><b>ENTER THE<br />LOKYX UNIVERSE</b></div></div>}
            <div className="modal-eyebrow">{panels[panel].eyebrow}</div>
            <h2>{panels[panel].title}</h2>
            <div className="modal-grid">{panels[panel].items.map((x,i) => <div key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b></div>)}</div>
            <button className="modal-enter" onClick={enter}>ENTER THE UNIVERSE <ArrowRight size={15}/></button>
            {panel === 'docs' && <div className="docs-note"><BookOpen size={14}/> Demo-first architecture · no wallet required to explore</div>}
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
