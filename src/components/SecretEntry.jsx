import {useState} from 'react';import {motion,AnimatePresence} from 'framer-motion';import confetti from 'canvas-confetti';
import {siteConfig as c} from '../data/config.js';
export default function SecretEntry({onUnlock}){
  const [v,setV]=useState('');const [tries,setTries]=useState(0);const [msg,setMsg]=useState('');const [ok,setOk]=useState(false);
  const submit=e=>{e.preventDefault();
    const norm=s=>s.trim().toLowerCase().replace(/\s+/g,' ');const target=c.mode==='code'?c.secretCode:c.secretAnswer;
    if(norm(v)===norm(target)){setOk(true);confetti({particleCount:90,spread:70,origin:{y:.6},colors:['#F5E6D3','#D4AF6A','#FDFBF7']});setTimeout(onUnlock,1400);}
    else{setMsg(c.wrongMessages[tries%c.wrongMessages.length]);setTries(t=>t+1);setV('');}};
  return <motion.main className="center entry" exit={{opacity:0,filter:'blur(12px)'}} transition={{duration:.9}}>
    <motion.div animate={ok?{scale:1.06,opacity:0}:{}} transition={{duration:1.2}}>
      <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.9}} className="hand">Hey you... 👀</motion.h1>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9,duration:.8}}>I made something for you.<br/>Only you can unlock this.</motion.p>
      <motion.form onSubmit={submit} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8,duration:.8}}>
        <label htmlFor="s" className="label">{c.mode==='code'?'Enter our secret code':c.secretQuestion}</label>
        <input id="s" value={v} onChange={e=>setV(e.target.value)} autoComplete="off" type={c.mode==='code'?'password':'text'} placeholder="..." />
        <button className="btn" type="submit">Unlock ✨</button>
        <AnimatePresence mode="wait"><motion.p key={tries} role="status" className="wrong" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}>{msg}</motion.p></AnimatePresence>
      </motion.form></motion.div></motion.main>;
}
