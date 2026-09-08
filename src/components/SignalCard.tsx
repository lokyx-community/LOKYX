import { motion } from 'framer-motion';
import { Archive, CornerUpRight, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function SignalCard({s}:{s:any}) {
 const [liked,setLiked]=useState(false);
 return <motion.article className="signal-card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
  <div className={`avatar ${s.hue}`}>{s.author[0]}</div><div className="signal-main">
   <div className="signal-meta"><b>{s.author}</b><span>{s.id}</span><span>· {s.time}</span></div>
   <p>{s.text}</p>
   <div className="signal-actions">
    <button className={liked?'active':''} onClick={()=>setLiked(!liked)}><Heart size={17} fill={liked?'currentColor':'none'}/><span>{s.resonates+(liked?1:0)}</span></button>
    <button><MessageCircle size={17}/><span>{s.echoes}</span></button><button><CornerUpRight size={17}/><span>Relay</span></button><button><Archive size={17}/></button>
   </div>
  </div>
 </motion.article>;
}
