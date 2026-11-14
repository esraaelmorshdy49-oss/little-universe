import {useEffect,useRef,useState} from 'react';
import {motion,animate,useMotionValue,useTransform,useReducedMotion} from 'framer-motion';
import * as content from '../data/content.js';
import * as config from '../data/config.js';

/* ==================================================================
   EDIT HERE: the birthday shown (with a heart) on the calendar page.
   You can also add  birthDate:{year:2026,month:10,day:19}  to siteConfig in config.js
   and it will be used instead of this default.
=================================================================== */
const DEFAULT_BIRTHDAY={year:2006,month:9,day:15};
const cfgDate=config.siteConfig&&config.siteConfig.birthDate;   // note: NOT "birthday", that name is used for the reveal text
const validDate=d=>d&&[d.year,d.month,d.day].every(Number.isFinite)&&d.month>=1&&d.month<=12&&d.day>=1&&d.day<=31;
const BIRTHDAY=validDate(cfgDate)?cfgDate:DEFAULT_BIRTHDAY;

/* ------------------------------------------------------------------
   PHOTOS
   Takes every photo from `albumPages` in ../data/content.js (any format)
   and spreads them evenly over the pages after the calendar page.
   Falls back to /assets/memories/memory-01.jpg ... memory-18.jpg
------------------------------------------------------------------- */
const P=n=>({src:`/assets/memories/memory-${String(n).padStart(2,'0')}.jpg`,alt:`Our photo ${n}`});
const toPhotos=list=>(list||[]).map(ph=>typeof ph==='string'?{src:ph}:ph);
const fromContent=Array.isArray(content.albumPages)
  ?content.albumPages.flatMap(e=>e&&(e.left||e.right)
    ?[...toPhotos(e.left&&e.left.photos),...toPhotos(e.right&&e.right.photos)]
    :toPhotos(e&&e.photos))
  :[];
const PHOTOS=fromContent.length?fromContent:Array.from({length:18},(_,i)=>P(i+1));

const BY_COUNT={1:['solo'],2:['duo'],3:['trio','hero','collage'],4:['grid','collage']};
function buildPages(photos){
  const total=photos.length;
  let k=Math.max(1,Math.ceil(total/3));
  if((k+1)%2)k++;                              // calendar page + photo pages = even number of pages
  const base=Math.floor(total/k),extra=total%k;
  const pages=[{type:'cal'}];let at=0;
  for(let i=0;i<k;i++){
    const n=Math.min(4,base+(i<extra?1:0));
    const opts=BY_COUNT[n]||['solo'];
    pages.push({type:'photos',layout:opts[i%opts.length],tone:i%2?'cream':'wine',photos:photos.slice(at,at+n)});
    at+=n;
  }
  return pages;
}
const PAGES=buildPages(PHOTOS);
const SPREADS=Array.from({length:PAGES.length/2},(_,i)=>({left:PAGES[2*i],right:PAGES[2*i+1]}));

const RINGS=22; // wire rings along the spiral

/* Photo slots, in % of one portrait page (x/y = top-left, w = width, r = rotation in degrees). */
const LAYOUT={
  solo:[{x:12,y:15,w:76,r:2,z:1}],
  duo:[{x:10,y:6,w:62,r:-3,z:1},{x:34,y:52,w:56,r:4,z:2}],
  trio:[{x:8,y:4,w:56,r:-4,z:2},{x:38,y:34,w:54,r:3,z:3},{x:6,y:58,w:46,r:-2,z:2}],
  hero:[{x:10,y:4,w:78,r:-1.5,z:1},{x:5,y:62,w:42,r:5,z:3},{x:52,y:66,w:38,r:-4,z:2}],
  grid:[{x:6,y:4,w:42,r:-3},{x:52,y:6,w:42,r:2},{x:6,y:50,w:42,r:2.5},{x:52,y:52,w:42,r:-2}],
  collage:[{x:5,y:3,w:46,r:-6,z:2},{x:44,y:14,w:48,r:4,z:3},{x:8,y:42,w:48,r:3,z:1},{x:46,y:58,w:44,r:-3,z:4}],
};

/* ------------------------------------------------------------------
   STYLES (self-contained). Cover / page colors are easy to change below.
------------------------------------------------------------------- */
const HEART_URI="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z'/%3E%3C/svg%3E\")";
const CSS=`
.alb-sec{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:72px 20px;max-width:960px;margin:0 auto}
.alb{--wine:#4a1226;--wine2:#33091a;--cream:#f9e5d3;position:relative;width:min(92vw,560px);margin:8px auto 0;padding:14px 0 22px;touch-action:pan-y;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;outline:none}
.alb:focus-visible{outline:2px solid #D4AF6A;outline-offset:6px;border-radius:12px}
.alb-book{position:relative;width:100%;aspect-ratio:4/3;perspective:1800px;cursor:grab}
.alb-book:active{cursor:grabbing}
.alb-book img{-webkit-user-drag:none;pointer-events:none}
.alb-shadow{position:absolute;inset:2% 0 -2%;border-radius:10px;box-shadow:0 22px 40px #000b,0 6px 14px #0008;transition:left .8s;left:0}
.alb-shadow.closed{left:50%}
.alb-half,.alb-leaf{position:absolute;top:0;bottom:0;width:50%}
.alb-half.l{left:0;border-radius:8px 2px 2px 8px;box-shadow:-3px 2px 0 #d9c7b0,-5px 4px 0 #c4b098}
.alb-half.r{left:50%;border-radius:2px 8px 8px 2px;box-shadow:3px 2px 0 #d9c7b0,5px 4px 0 #c4b098}
.alb-leaf{transform-style:preserve-3d;z-index:10}
.alb-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;background:#f3e3cf}
.alb-face.back{transform:rotateY(180deg)}
.alb-face.l{border-radius:8px 2px 2px 8px}
.alb-face.r{border-radius:2px 8px 8px 2px}
.alb-face.cover{border-radius:3px 10px 10px 3px;background:linear-gradient(145deg,var(--wine),var(--wine2));box-shadow:inset 0 0 0 1px #00000040,3px 2px 0 #2a0715,5px 4px 0 #20050f}
.alb-wave{position:absolute;inset:0;width:100%;height:100%}
.alb-sprig{position:absolute;right:7%;bottom:5%;width:22%;opacity:.95}
.alb-strap{position:absolute;right:-1px;top:48%;width:62%;height:11%;background:linear-gradient(#6b1c36,#4a1226);border-radius:999px 0 0 999px;box-shadow:0 3px 6px #0008,inset 0 0 0 1px #ffffff14;z-index:3}
.alb-snap{position:absolute;left:9%;top:50%;width:clamp(16px,4.6vw,24px);aspect-ratio:1;transform:translateY(-50%);border-radius:50%;background:radial-gradient(circle at 35% 30%,#f6e2ac,#D4AF6A 55%,#8a6b2a);box-shadow:0 2px 4px #000a}
.alb-snap::after{content:'';position:absolute;inset:28%;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff3cc,#b98d3f)}
.alb-shade{position:absolute;inset:0;background:linear-gradient(90deg,#0000,#000a);pointer-events:none}
.alb-under{position:absolute;inset:0;background:linear-gradient(90deg,#0007,#0000 45%);pointer-events:none;z-index:5}
.alb-spine{position:absolute;left:50%;top:0;bottom:0;width:5%;transform:translateX(-50%);background:linear-gradient(90deg,#0000,#0002 45%,#0004 50%,#0002 55%,#0000);pointer-events:none;z-index:20;transition:opacity .6s}
.alb-rings,.alb-holes{position:absolute;top:4%;bottom:4%;display:flex;flex-direction:column;justify-content:space-between}
.alb-rings{left:50%;width:clamp(18px,5vw,28px);transform:translateX(-50%);z-index:30;pointer-events:none}
.alb-ring{height:clamp(3px,.95vw,5px);border-radius:6px;background:linear-gradient(#e2e2e6,#55555a 50%,#c6c6ca);box-shadow:0 1px 2px #000a}
.alb-holes{width:10px;z-index:2;pointer-events:none}
.alb-holes.l{right:4px}
.alb-holes.r{left:4px}
.alb-holes i{display:block;width:7px;height:clamp(3px,.95vw,5px);border-radius:3px;background:#1b0b10;box-shadow:inset 0 1px 2px #000,0 0 0 1px #0003}
.alb-pg{position:absolute;inset:0;overflow:hidden}
.alb-pg::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg,#ffffff07 0 2px,#00000007 2px 4px);pointer-events:none}
.alb-pg.wine{background:radial-gradient(ellipse at 30% 20%,#5a1830,#3a0c1c 70%)}
.alb-pg.cream{background:radial-gradient(ellipse at 50% 40%,#fff3e6,#f7e3d0 80%)}
.alb-pg.cal{background:linear-gradient(160deg,#a8626f,#8c4756 55%,#7a3a49)}
.alb-pg.cal::before{content:'';position:absolute;inset:0;background:#5e1a2b;clip-path:polygon(0 0,20% 0,10% 100%,0 100%)}
.alb-blob{position:absolute;border-radius:50%;pointer-events:none;width:62%;aspect-ratio:1}
.wine .alb-blob{right:-24%;top:-14%;background:#f7e3d0;opacity:.95}
.cream .alb-blob{left:-26%;bottom:-14%;background:#4a1224}
.alb-cal{position:absolute;left:9%;right:9%;top:20%;color:#fde8e0;font-family:Cairo,system-ui,sans-serif;z-index:2}
.alb-cal-h{font-family:Caveat,Cairo,cursive;font-weight:700;font-size:clamp(1.5rem,6.4vw,2.6rem);line-height:1}
.alb-cal-y{font-size:clamp(.6rem,2.3vw,.85rem);letter-spacing:.3em;opacity:.8;margin:2px 0 8px}
.alb-cal-g{display:grid;grid-template-columns:repeat(7,1fr);row-gap:clamp(2px,1vw,6px);text-align:center;font-size:clamp(.56rem,2.5vw,.8rem)}
.alb-cal-g b{font-weight:600;opacity:.75;font-size:.85em}
.alb-cal-g span{position:relative;line-height:2}
.alb-cal-g .on{color:#5a1428;font-weight:700;z-index:1}
.alb-cal-g .on::before{content:'';position:absolute;inset:-22%;background:${HEART_URI} center/contain no-repeat;z-index:-1;filter:drop-shadow(0 0 4px #fff9)}
.alb-star{position:absolute;pointer-events:none}
.alb-pol{position:absolute;margin:0;font-size:clamp(7px,2vw,12px);background:#fffdf8;padding:.5em .5em 1.7em;border-radius:2px;box-shadow:0 1px 2px #0005,0 6px 12px #0004;z-index:1}
.alb-pol img,.alb-ph{display:block;width:100%;aspect-ratio:1;object-fit:cover;background:#e5d9c3}
.alb-ph{display:grid;place-items:center;font-size:2em;opacity:.6}
.alb-tape{position:absolute;width:3.4em;height:1.2em;background:#D4AF6A77;z-index:5}
`;

/* ------------------------------------------------------------------
   SMALL COMPONENTS
------------------------------------------------------------------- */
const HEART="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z";
const STAR4="M12 1c1 6 5 10 11 11-6 1-10 5-11 11-1-6-5-10-11-11 6-1 10-5 11-11z";
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const Holes=({side})=><span className={'alb-holes '+side} aria-hidden="true">{Array.from({length:RINGS},(_,i)=><i key={i}/>)}</span>;

function Polaroid({p,slot,i}){
  const [bad,setBad]=useState(false);
  const tape=i%3===0
    ?{left:'32%',top:'-.6em',transform:`rotate(${i%2?4:-6}deg)`,background:i%2?'#e7b8c577':'#D4AF6A77'}
    :i%3===1?{left:'-1.2em',top:'.4em',transform:'rotate(-40deg)'}:null;
  return (
    <figure className="alb-pol" style={{left:slot.x+'%',top:slot.y+'%',width:slot.w+'%',transform:`rotate(${slot.r}deg)`,zIndex:slot.z||1}}>
      {tape&&<span className="alb-tape" style={tape} aria-hidden="true"/>}
      {bad
        ?<div className="alb-ph" aria-hidden="true">📷</div>
        :<img src={p.src} alt={p.alt||'Our photo'} loading="lazy" draggable={false} onError={()=>setBad(true)}/>}
    </figure>
  );
}

// Calendar page: the birthday is circled with a white heart.
function Calendar(){
  const {year,month,day}=BIRTHDAY;
  const first=new Date(year,month-1,1).getDay(),count=new Date(year,month,0).getDate();
  const name=new Date(year,month-1,1).toLocaleString('en-US',{month:'long'});
  const cells=[...Array(first).fill(null),...Array.from({length:count},(_,i)=>i+1)];
  return (
    <>
      <svg className="alb-star" style={{left:'14%',top:'8%',width:'9%'}} viewBox="0 0 24 24" fill="#fde8e0" aria-hidden="true"><path d={STAR4}/></svg>
      <svg className="alb-star" style={{left:'3%',bottom:'6%',width:'22%',transform:'rotate(-12deg)'}} viewBox="0 0 24 24" fill="#7d2238" aria-hidden="true"><path d={STAR4}/></svg>
      <div className="alb-cal" role="img" aria-label={`Calendar, ${name} ${year}, birthday on the ${day}`}>
        <div className="alb-cal-h">{name}</div>
        <div className="alb-cal-y">{year}</div>
        <div className="alb-cal-g">
          {DAYS.map(d=><b key={d}>{d}</b>)}
          {cells.map((c,i)=><span key={i} className={c===day?'on':''}>{c}</span>)}
        </div>
      </div>
    </>
  );
}

// One album page (portrait): calendar page or a page of photos.
function Page({data,side}){
  if(!data)return null;
  if(data.type==='cal')return <div className="alb-pg cal"><Holes side={side}/><Calendar/></div>;
  const slots=LAYOUT[data.layout]||LAYOUT.solo;
  return (
    <div className={'alb-pg '+data.tone}>
      <span className="alb-blob" aria-hidden="true"/>
      <Holes side={side}/>
      {data.photos.slice(0,slots.length).map((p,i)=><Polaroid key={i+(p.src||'')} p={p} slot={slots[i]} i={i}/>)}
    </div>
  );
}

// Wine-colored cover with a cream wave, a little heart sprig and a strap closed by a gold snap.
function Cover({unsnap}){
  return (
    <>
      <Holes side="r"/>
      <svg className="alb-wave" viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true"><path d="M100 0H68C52 22 66 46 58 74C50 104 74 124 62 150H100Z" fill="#f9e5d3"/></svg>
      <svg className="alb-sprig" viewBox="0 0 48 64" aria-hidden="true">
        <path d="M24 62C24 44 22 30 26 10" stroke="#4a1226" strokeWidth="1.6" fill="none"/>
        {[[6,30,-18],[26,34,16],[20,14,0],[8,46,-10]].map(([x,y,r],i)=><path key={i} d={HEART} fill="#4a1226" transform={`translate(${x} ${y}) rotate(${r} 6 6) scale(.55)`}/>)}
      </svg>
      <motion.div className="alb-strap" animate={unsnap?{x:'45%',opacity:0}:{x:0,opacity:1}} transition={{duration:.35,ease:'easeIn'}}>
        <span className="alb-snap"/>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------- */
export default function MemoryAlbum(){
  const rm=useReducedMotion();
  const A=SPREADS,N=A.length;
  const [s,setS]=useState(-1);            // -1 = closed book, otherwise index of the open spread
  const [turn,setTurn]=useState(0);       // 1 = turning forward, -1 = turning back, 0 = idle
  const [unsnap,setUnsnap]=useState(false);
  const p=useMotionValue(0);              // page-turn progress, 0..1
  const bookRef=useRef(null);
  const ptr=useRef(null);                 // current pointer gesture
  const busy=useRef(false);

  const rotF=useTransform(p,[0,1],[0,-180]);       // forward: right page swings over the spiral
  const rotB=useTransform(p,[0,1],[0,180]);        // backward: left page swings back
  const shade=useTransform(p,[0,.5,1],[0,.5,0]);   // darkens the page mid-turn
  const under=useTransform(p,[0,1],[.45,0]);       // shadow on the page being uncovered

  const can=d=>d===1?s<N-1:s>=1;

  // Preload the photos of the next two spreads so pages never flash empty while turning.
  useEffect(()=>{
    for(let i=s+1;i<=s+2&&i<N;i++)if(i>=0)[A[i].left,A[i].right].forEach(pg=>pg&&pg.photos&&pg.photos.forEach(ph=>{const im=new Image();im.src=ph.src;}));
  },[s]); // eslint-disable-line react-hooks/exhaustive-deps

  // Animates the leaf to the end (done) or back to the start, then commits the new spread.
  const finish=(d,done)=>{
    busy.current=true;
    animate(p,done?1:0,{
      duration:rm?.25:done?.6:.35,
      ease:[.32,.72,.25,1],
      onComplete:()=>{if(done)setS(v=>v+d);setTurn(0);p.set(0);busy.current=false;}
    });
  };
  const auto=d=>{if(busy.current||!can(d))return;setTurn(d);finish(d,true);};

  // Closed book: the strap unsnaps first, then the cover swings open.
  const openBook=()=>{
    if(busy.current)return;
    busy.current=true;setUnsnap(true);
    setTimeout(()=>{busy.current=false;auto(1);},rm?0:380);
  };

  const tap=x=>{
    if(busy.current)return;
    if(s===-1){openBook();return;}
    const r=bookRef.current.getBoundingClientRect(),f=(x-r.left)/r.width;
    if(f>.55)auto(1);else if(f<.45)auto(-1);
  };

  // Pointer gestures. touch-action: pan-y lets the browser keep vertical scrolling;
  // a flip only starts when the movement is clearly horizontal.
  const onDown=e=>{
    if(busy.current||(e.pointerType==='mouse'&&e.button!==0))return;
    ptr.current={id:e.pointerId,x:e.clientX,y:e.clientY,px:e.clientX,pt:performance.now(),v:0,mode:'pending',dir:0};
  };
  const onMove=e=>{
    const k=ptr.current;
    if(!k||k.id!==e.pointerId||k.mode==='ignore')return;
    const dx=e.clientX-k.x,dy=e.clientY-k.y;
    if(k.mode==='pending'){
      const ax=Math.abs(dx),ay=Math.abs(dy);
      if(ax<8&&ay<8)return;
      if(ax<ay*1.2){k.mode='ignore';return;}
      const d=dx<0?1:-1;
      if(!can(d)){k.mode='ignore';return;}
      k.mode='drag';k.dir=d;
      try{e.currentTarget.setPointerCapture(e.pointerId);}catch(err){}
      setTurn(d);if(s===-1)setUnsnap(true);
    }
    const now=performance.now();
    if(now-k.pt>0)k.v=(e.clientX-k.px)/(now-k.pt);
    k.px=e.clientX;k.pt=now;
    p.set(Math.min(1,Math.max(0,(k.dir===1?-dx:dx)/(bookRef.current.offsetWidth/2))));
  };
  const onUp=e=>{
    const k=ptr.current;
    if(!k||k.id!==e.pointerId)return;
    ptr.current=null;
    if(k.mode==='drag'){
      const v=k.dir===1?-k.v:k.v;                 // px per ms in the turning direction
      const done=p.get()>.3||v>.45;               // far enough or flicked -> complete, else spring back
      if(!done&&s===-1)setUnsnap(false);
      finish(k.dir,done);
    }else if(k.mode==='pending')tap(e.clientX);
  };
  const onCancel=()=>{
    const k=ptr.current;ptr.current=null;
    if(k&&k.mode==='drag'){if(s===-1)setUnsnap(false);finish(k.dir,false);}
  };
  const onKey=e=>{
    const fwd=['ArrowRight','Enter',' '].includes(e.key),back=e.key==='ArrowLeft';
    if(!fwd&&!back)return;
    e.preventDefault();
    if(s===-1){if(fwd)openBook();return;}
    auto(back?-1:1);
  };

  // Which pages are visible underneath the turning leaf
  const d=turn||(s===-1?1:0);
  const bl=d===-1?s-1:s;
  const br=d===1?s+1:Math.max(s,0);
  const leafStyle=d===1
    ?{left:'50%',transformOrigin:'left center',rotateY:rotF}
    :{left:0,transformOrigin:'right center',rotateY:rotB};
  const shadeEl=<motion.div className="alb-shade" style={{opacity:shade}}/>;

  return (
    <motion.section className="alb-sec" initial={rm?false:{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.8}}>
      <style>{CSS}</style>
      <motion.div
        className="alb" tabIndex={0} role="group" aria-roledescription="photo album"
        aria-label="Our photo album. Swipe, tap the page edges, or use the arrow keys to turn pages."
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onCancel} onKeyDown={onKey}
        animate={s===-1&&!rm&&!turn&&!unsnap?{y:[0,-5,0],rotate:[-.5,.5,-.5]}:{y:0,rotate:0}}
        transition={s===-1&&!unsnap?{repeat:Infinity,duration:4.5,ease:'easeInOut'}:{duration:.4}}
      >
        {/* shifts left while closed so the single cover looks centered */}
        <motion.div animate={{x:s===-1?'-25%':'0%'}} transition={{duration:.8,ease:[.32,.72,.25,1]}}>
          <div className="alb-book" ref={bookRef}>
            <div className={'alb-shadow'+(s===-1?' closed':'')}/>

            {bl>=0&&(
              <div className="alb-half l">
                <Page data={A[bl]&&A[bl].left} side="l"/>
                {d===-1&&<motion.div className="alb-under" style={{opacity:under,transform:'scaleX(-1)'}}/>}
              </div>
            )}
            <div className="alb-half r">
              <Page data={A[br]&&A[br].right} side="r"/>
              {d===1&&<motion.div className="alb-under" style={{opacity:under}}/>}
            </div>

            {d!==0&&(
              <motion.div className="alb-leaf" style={leafStyle}>
                {d===1?(
                  <>
                    <div className={'alb-face '+(s===-1?'cover':'r')}>
                      {s===-1?<Cover unsnap={unsnap}/>:<><Page data={A[s]&&A[s].right} side="r"/>{shadeEl}</>}
                    </div>
                    <div className="alb-face back l"><Page data={A[s+1]&&A[s+1].left} side="l"/>{shadeEl}</div>
                  </>
                ):(
                  <>
                    <div className="alb-face l"><Page data={A[s]&&A[s].left} side="l"/>{shadeEl}</div>
                    <div className="alb-face back r"><Page data={A[s-1]&&A[s-1].right} side="r"/>{shadeEl}</div>
                  </>
                )}
              </motion.div>
            )}

            <div className="alb-spine" style={{opacity:s===-1&&!turn?0:1}}/>
            {/* spiral wire rings, always on top of the pages */}
            <div className="alb-rings" aria-hidden="true">
              {Array.from({length:RINGS},(_,i)=><span key={i} className="alb-ring"/>)}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}