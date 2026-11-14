import {useState} from 'react';import {motion,AnimatePresence} from 'framer-motion';import confetti from 'canvas-confetti';import Reveal from './Reveal.jsx';import {siteConfig as C} from '../data/config.js';
const col=['#F5E6D3','#D4AF6A','#FDFBF7'];
export default function CakeSection(){
  const [out,setOut]=useState(false);const k=C.cake;
  const blow=()=>{setOut(true);
    setTimeout(()=>confetti({particleCount:60,spread:80,origin:{y:.7},scalar:.9,colors:col,disableForReducedMotion:true}),500);
    [[.2,.25],[.8,.2],[.5,.15],[.3,.4],[.72,.38]].forEach(([x,y],i)=>setTimeout(()=>confetti({particleCount:26,spread:360,startVelocity:13,gravity:.5,ticks:70,scalar:.6,origin:{x,y},colors:col,disableForReducedMotion:true}),700+i*380));};
  return <section className="sec center"><Reveal><h2>{k.title}</h2></Reveal>
    <Reveal><svg viewBox="0 0 200 180" className={'cake'+(out?' glow':'')} role="img" aria-label="Birthday cake with candles">
      <rect x="30" y="110" width="140" height="50" rx="10" fill="#F5E6D3"/><rect x="45" y="75" width="110" height="40" rx="10" fill="#FDFBF7"/>
      <path d="M30 120q14 14 28 0t28 0 28 0 28 0 28 0" stroke="#D4AF6A" strokeWidth="3" fill="none"/>
      {[75,100,125].map(x=><g key={x}><rect x={x-3} y="50" width="6" height="26" rx="2" fill="#0F172A" stroke="#F5E6D3"/>
        <AnimatePresence>{!out&&<motion.ellipse key="f" cx={x} cy="44" rx="5" ry="8" fill="#D4AF6A" exit={{opacity:0,scale:0}} animate={{scaleY:[1,1.15,1]}} transition={{repeat:Infinity,duration:1.2}}/>}</AnimatePresence>
        {out&&<motion.circle cx={x} cy="44" r="3" fill="#F5E6D3" initial={{opacity:.7,cy:44}} animate={{opacity:0,cy:10}} transition={{duration:1.6}}/>}</g>)}
    </svg></Reveal>
    {!out?<button className="btn" onClick={blow}>{k.button}</button>:
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9,duration:1}}><p className="hand big">{k.wish}</p><p>{k.after}</p>
        <button className="btn ghost" onClick={()=>setOut(false)}>{k.again}</button></motion.div>}</section>;
}
