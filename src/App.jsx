import {useRef,useState} from 'react';import {AnimatePresence,motion} from 'framer-motion';
import StarBackground from './components/StarBackground.jsx';import MusicPlayer from './components/MusicPlayer.jsx';import SecretEntry from './components/SecretEntry.jsx';
import Birthday from './components/Birthday.jsx';import Surprise from './components/Surprise.jsx';
import {VideoSection,Final} from './components/Sections.jsx';import MemoryAlbum from './components/MemoryAlbum.jsx';import CakeSection from './components/CakeSection.jsx';
import LetterSection from './components/LetterSection.jsx';import {siteConfig} from './data/config.js';
export default function App(){
  const [stage,setStage]=useState('entry');const [playing,setPlaying]=useState(false);const [blocked,setBlocked]=useState(false);const [run,setRun]=useState(0);const a=useRef(null);
  const play=()=>a.current?.play().then(()=>{setPlaying(true);setBlocked(false)}).catch(()=>setBlocked(true));
  const toggle=()=>playing?(a.current.pause(),setPlaying(false)):play();
  const to=s=>{setStage(s);window.scrollTo(0,0)};
  const replay=()=>{window.scrollTo({top:0,behavior:'smooth'});setTimeout(()=>{to('entry');setRun(r=>r+1);a.current?.pause();a.current&&(a.current.currentTime=0);setPlaying(false);setBlocked(false)},700)};
  const fade={initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.8}};
  return <><StarBackground/><div className={'veil'+(stage==='birthday'?' on':'')}/><audio ref={a} src={siteConfig.musicUrl} loop preload="none" onError={()=>setBlocked(false)}/>
    <AnimatePresence mode="wait">
      {stage==='entry'&&<SecretEntry key={'e'+run} onUnlock={()=>{to('birthday');play()}}/>}
      {stage==='birthday'&&<motion.div key="b" {...fade}><Birthday onDone={()=>to('question')}/></motion.div>}
      {stage==='question'&&<motion.div key="q" {...fade}><Surprise onDone={()=>to('story')}/></motion.div>}
      {stage==='story'&&<motion.div key="s" {...fade}><VideoSection/><MemoryAlbum/><LetterSection/><CakeSection/><Final onReplay={replay}/></motion.div>}
    </AnimatePresence>
    {stage!=='entry'&&<MusicPlayer playing={playing} blocked={blocked} onToggle={toggle}/>}</>;
}