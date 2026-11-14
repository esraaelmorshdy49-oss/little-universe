import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig as c } from '../data/config.js';
import { Kiss, Heart, Star } from './Stickers.jsx';

const s = c.surprise;

function Card({ title, text, btn, onClick, icon }) {
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div role="dialog" aria-modal="true" className="note pop" initial={{ scale: .7, rotate: -6 }} animate={{ scale: 1, rotate: -1 }} exit={{ scale: .8, opacity: 0 }}>
        {icon}
        <h3 className="hand big">{title}</h3>
        <p>{text}</p>
        <button className="btn" autoFocus onClick={onClick}>{btn}</button>
      </motion.div>
    </motion.div>
  );
}

export default function Surprise({ onDone }) {
  const [tries, setTries] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [warn, setWarn] = useState(false);
  const [yes, setYes] = useState(false);

  const dodge = () => {
    const m = window.innerWidth < 500 ? 90 : 160;
    setPos({ x: (Math.random() - .5) * 2 * m, y: (Math.random() - .5) * 120 });
  };

  const down = e => {
    if (tries >= s.noAttempts) { return; }
    e.preventDefault();
    const t = tries + 1;
    setTries(t);
    if (t >= s.noAttempts) {
      setPos({ x: 0, y: 0 });
      setWarn(true);
    } else {
      dodge();
    }
  };

  return (
    <main className="center full">
      <motion.h2 className="hand glowtxt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }}>
        {s.question}
      </motion.h2>

      <div className="row yn">
        <button className="btn" onClick={() => setYes(true)}>{s.yes}</button>
        <motion.button
          className="btn ghost"
          animate={pos}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          onPointerEnter={e => e.pointerType === 'mouse' && tries < s.noAttempts && dodge()}
          onPointerDown={down}
          onKeyDown={e => e.key === 'Enter' && down(e)}
          onClick={e => e.preventDefault()}
        >
          {s.no}
        </motion.button>
      </div>

      <Star className="fl a" size={30} />
      <Heart className="fl b" size={26} />

      <AnimatePresence>
        {warn && (
          <Card
            key="w"
            title={s.noTitle}
            text={s.noText}
            btn={s.noButton}
            onClick={() => setWarn(false)}
            icon={<div className="face-stk">😭</div>}
          />
        )}

        {yes && (
          <Card
            key="y"
            title={s.yesTitle}
            text={s.yesText}
            btn={s.yesButton}
            onClick={onDone}
            icon={
              <video
  src="/assets/video/sticker_fixed.mp4"
  autoPlay
  loop
  muted
  playsInline
  aria-label="sticker"
  style={{
    width: '120px',
    height: '120px',
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto 10px',
    background: 'transparent'
  }}
/>
            }
          />
        )}
      </AnimatePresence>
    </main>
  );
}