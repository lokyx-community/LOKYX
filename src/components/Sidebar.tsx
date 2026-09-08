import { Compass, Gamepad2, Globe2, Home, MessageCircle, Package, Radio, Search, Shield, Sparkles, UserRound, Wallet, Zap } from 'lucide-react';

const groups = [
  {label:'WORLD', items:[['Pulse',Radio],['Traverse',Compass],['Realms',Globe2],['Districts',Zap],['Nexuses',Shield]]},
  {label:'SOCIAL', items:[['Whispers',MessageCircle],['Notifications',Sparkles]]},
  {label:'UNIVERSE', items:[['Arcade',Gamepad2],['Bazaar',Package],['Vault',Package]]},
  {label:'IDENTITY', items:[['Character',UserRound],['Identity',Home],['Core',Wallet]]},
] as const;

export default function Sidebar({page,setPage}:{page:string;setPage:(p:string)=>void}) {
  return <aside className="sidebar">
    <button className="brand" onClick={()=>setPage('Pulse')}><span className="brand-mark">L</span><span>LOKYX</span></button>
    <div className="side-scroll">
      {groups.map(g=><div className="nav-group" key={g.label}>
        <div className="nav-label">{g.label}</div>
        {g.items.map(([name,Icon])=><button className={`nav-item ${page===name?'selected':''}`} key={name} onClick={()=>setPage(name)}><Icon size={17}/><span>{name}</span>{page===name&&<i className="nav-pip"/>}</button>)}
      </div>)}
    </div>
    <button className={`companion-mini ${page==='Companion'?'selected':''}`} onClick={()=>setPage('Companion')}><span className="companion-orb"/><div><b>Companion</b><small>Awake · online</small></div><span className="nav-pip"/></button>
  </aside>;
}
