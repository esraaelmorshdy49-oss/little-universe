import {useState} from 'react';import {siteConfig as c} from '../data/config.js';import Reveal from './Reveal.jsx';
export function VideoSection(){
  const [bad,setBad]=useState(false);const v=c.video;
  return <section className="sec center"><Reveal><p className="hand big">{v.leadIn}</p><h2>{v.title}</h2><p>{v.line1}<br/>{v.line2}</p></Reveal>
    <Reveal><div className="vcard">{bad?<div className="ph tall"><span>{v.placeholder}</span></div>:
      <video controls playsInline preload="none" onError={()=>setBad(true)}><source src={c.videoUrl} type="video/mp4" onError={()=>setBad(true)}/></video>}</div>
      <p className="hand">{v.caption}</p></Reveal></section>;
}
export function Final({onReplay}){
  const f=c.final;
  return <section className="sec center full"><Reveal><p className="hand big">{f.opener}</p></Reveal>
    <Reveal delay={.6}><p>{f.lines.join(' ')}</p></Reveal>
    <Reveal delay={1.2}><p className="toast">{f.toast.map(l=><span key={l}>{l}<br/></span>)}</p></Reveal>
    <Reveal delay={1.6}><button className="btn" onClick={onReplay}>{f.replay}</button></Reveal>
    <footer><p>{f.footer}</p><p className="hand">{f.tag}</p></footer></section>;
}
