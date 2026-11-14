import {useEffect,useState,useMemo} from 'react';import {motion,AnimatePresence} from 'framer-motion';import confetti from 'canvas-confetti';
import {siteConfig as c} from '../data/config.js';import {Heart,Star} from './Stickers.jsx';
const colors=['#F5E6D3','#D4AF6A','#FDFBF7','#f2a1a8'];
const MAX_GROW=10; // عدد الضغطات على No اللي بعدها Yes يبطل يكبر
const STEP=0.3;    // قد إيه Yes بيكبر في كل ضغطة (كل ما زوّدتي الرقم يكبر أسرع)
const pop=(o={})=>confetti({particleCount:24,spread:360,startVelocity:12,gravity:.5,ticks:80,scalar:.7,origin:{x:.5,y:.45},colors,disableForReducedMotion:true,...o});
export default function Birthday({onDone}){
  const [n,setN]=useState(3);const [btn,setBtn]=useState(false);const [no,setNo]=useState(0);
  const floaters=useMemo(()=>Array.from({length:14},(_,i)=>({i,l:Math.random()*90+4,d:Math.random()*4,t:5+Math.random()*4,h:i%3})),[]);
  useEffect(()=>{
    if(n==='go')return;pop();
    const t=setTimeout(()=>setN(n===1?'go':n-1),1100);return()=>clearTimeout(t);
  },[n]);
  useEffect(()=>{if(n!=='go')return;
    const f=(x,y,k)=>setTimeout(()=>confetti({particleCount:50,spread:80,origin:{x,y},colors,disableForReducedMotion:true}),k);
    f(.2,.6,0);f(.8,.6,250);f(.5,.5,600);const b=setTimeout(()=>setBtn(true),3500);return()=>clearTimeout(b)},[n]);
  const grow=Math.min(no,MAX_GROW);
  const yesStyle={fontSize:`${1+grow*STEP}rem`,padding:`${12+grow*4}px ${24+grow*8}px`,transition:'font-size .35s ease,padding .35s ease,transform .2s,box-shadow .2s,background .2s'};
  return <main className="center full dim" aria-live="polite">
    <AnimatePresence mode="wait">
      {n!=='go'?<motion.div key={n} className="count" initial={{scale:.3,opacity:0,filter:'blur(10px)'}} animate={{scale:1,opacity:1,filter:'blur(0px)'}} exit={{scale:1.7,opacity:0}} transition={{duration:.6}}>{n}</motion.div>
      :<motion.div key="r" className="center" initial={{opacity:0,y:24,filter:'blur(12px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{duration:1.1}}>
        <h1 className="hand glowtxt">{c.birthday.title}</h1>
        <motion.p style={{whiteSpace:'pre-line'}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1,duration:1}}>{c.birthday.subtitle}</motion.p>
        {btn&&<motion.div className="row" style={{alignItems:'center',gap:14,marginTop:8}} initial={{opacity:0}} animate={{opacity:1}}>
          <button className="btn" style={yesStyle} onClick={onDone}>{c.birthday.next}</button>
          <button className="btn ghost" onClick={()=>setNo(v=>v+1)}>{c.birthday.no||'No'}</button>
        </motion.div>}
      </motion.div>}
    </AnimatePresence>
    {n==='go'&&<div className="floaters" aria-hidden="true">{floaters.map(f=><span key={f.i} style={{left:f.l+'%',animationDelay:f.d+'s',animationDuration:f.t+'s'}}>{f.h?<Heart size={20}/>:<Star size={18}/>}</span>)}</div>}
  </main>;
}