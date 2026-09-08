import { Bell, Search, UserRound, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const pages = ['Pulse','Traverse','Realms','Districts','Nexuses','Whispers','Notifications','Arcade','Bazaar','Vault','Character','Identity','Core','Companion'];

export default function Topbar({setPage}:{setPage:(p:string)=>void}) {
  const [query, setQuery] = useState('');
  const matches = useMemo(() => query.trim() ? pages.filter(p => p.toLowerCase().includes(query.toLowerCase())).slice(0,5) : [], [query]);
  const go = (page:string) => { setQuery(''); setPage(page); };
  return <header className="topbar">
    <button className="mobile-brand" onClick={()=>go('Pulse')}>L<span>OKYX</span></button>
    <div className="scan-wrap">
      <div className="scan"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} onFocus={()=>{}} placeholder="Scan the universe..."/><kbd>⌘ K</kbd>{query && <button className="scan-clear" onClick={()=>setQuery('')}><X size={13}/></button>}</div>
      {matches.length > 0 && <div className="search-results">{matches.map(p=><button key={p} onClick={()=>go(p)}><Search size={12}/>{p}<span>OPEN</span></button>)}</div>}
    </div>
    <div className="top-actions"><button onClick={()=>go('Notifications')} aria-label="Notifications"><Bell size={18}/><i/></button><button className="identity-chip" onClick={()=>go('Identity')}><span className="mini-avatar"><UserRound size={12}/></span>@traveler</button></div>
  </header>;
}
