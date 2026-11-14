import {useMemo} from 'react';
export default function StarBackground(){
  const stars=useMemo(()=>Array.from({length:70},(_,i)=>({id:i,l:Math.random()*100,t:Math.random()*100,s:Math.random()*2+1,o:Math.random()*.6+.2,d:Math.random()*5+3,dl:Math.random()*5,gold:i%12===0})),[]);
  return <div className="stars" aria-hidden="true">{stars.map(s=><i key={s.id} className={s.gold?'gold':''} style={{left:s.l+'%',top:s.t+'%',width:s.s,height:s.s,opacity:s.o,animationDuration:s.d+'s',animationDelay:s.dl+'s'}}/>)}</div>;
}
