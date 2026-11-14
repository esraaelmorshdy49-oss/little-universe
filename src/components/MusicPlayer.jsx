import {Music,Pause,Play} from 'lucide-react';
import {siteConfig} from '../data/config.js';
export default function MusicPlayer({playing,blocked,onToggle}){
  return <div className="music">{blocked&&!playing&&<span className="tip">Tap to play our song 🎵</span>}
    <button onClick={onToggle} aria-label={playing?'Pause music':'Play music'} className="btn round">
      {playing?<Pause size={18}/>:<Play size={18}/>}<Music size={16}/>{playing&&<span className="eq"><b/><b/><b/></span>}
    </button><span className="song">{siteConfig.songTitle}</span></div>;
}
