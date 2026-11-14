import {useState,useEffect} from 'react';import {motion,AnimatePresence} from 'framer-motion';import {X} from 'lucide-react';
import {mainLetter} from '../data/content.js';import {siteConfig as c} from '../data/config.js';import Reveal from './Reveal.jsx';import {Heart,Star} from './Stickers.jsx';
export default function LetterSection(){
  const [st,setSt]=useState('closed');const [read,setRead]=useState(false);
  const start=()=>{if(st!=='closed')return;setSt('wiggle');setTimeout(()=>setSt('flap'),600);setTimeout(()=>setSt('paper'),1300);setTimeout(()=>setRead(true),2200)};
  const close=()=>{setRead(false);setSt('closed')};
  useEffect(()=>{const k=e=>e.key==='Escape'&&close();window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[]);
  const flap=st==='flap'||st==='paper';
  return <section className="sec center"><Reveal className="center">
    <motion.div className="bigenv" animate={st==='wiggle'?{rotate:[0,-3,3,-2,2,0]}:{}} transition={{duration:.6}}>
      <Heart className="pst e1" size={28}/><Star className="pst e2" size={24}/>
      <motion.div className="paper-in" animate={{y:st==='paper'?-70:0}} transition={{duration:.8}}><span className="hand">{mainLetter.title}</span></motion.div>
      <div className="env-front"><span className="hand addr">{c.letter.note}</span></div>
      <motion.div className="env-flap" style={{transformOrigin:'top'}} animate={{rotateX:flap?180:0,zIndex:flap?0:3}} transition={{duration:.6}}/>
      <motion.button className="gseal" onClick={start} aria-label={c.letter.open} animate={{opacity:flap?0:1,scale:flap?1.6:1}}>♥</motion.button>
    </motion.div>
    </Reveal>
    <AnimatePresence>{read&&<motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close}>
      <motion.article role="dialog" aria-modal="true" className="letter big" onClick={e=>e.stopPropagation()} initial={{scaleY:.2,y:120,opacity:0}} animate={{scaleY:1,y:0,opacity:1}} exit={{y:80,opacity:0}} transition={{duration:.8}}>
        <button className="x" onClick={close} aria-label={c.letter.close}><X size={18}/></button>
        <h3 className="hand big">{mainLetter.title}</h3>
        <motion.p style={{whiteSpace:'pre-wrap'}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7,duration:1.2}}>{mainLetter.message}</motion.p>
      </motion.article></motion.div>}</AnimatePresence></section>;
}
